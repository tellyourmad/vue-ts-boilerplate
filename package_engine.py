#!/usr/bin/python
# coding:utf-8
# base on: pip install fabric==1.14.1

__author__ = 'Frank'
__version__ = '1.1.6'

import os, os.path, glob, re, sys, time, datetime, json, warnings
import xml.etree.ElementTree as ET
import sys
import requests

from fabric.api import lcd, local, cd, hosts, task, settings
from fabric.operations import run, put, sudo
from fabric.contrib.project import rsync_project
from fabric.contrib.files import exists, append


class PackageEngine:
    '''
    args:
        stage: APP目前阶段，如 test, production
    '''

    def __init__(self, stage='test', auto_inc_version=False, upload_accounts={}):
        reload(sys)
        sys.setdefaultencoding('utf8')

        self.app_config = self._parse_config_xml()

        self.stage = stage
        self.auto_inc_version = auto_inc_version

        self.ipa_path = None
        self.apk_path = None

        # 上传平台账号
        self.upload_accounts = upload_accounts

        if (auto_inc_version):
            version = self.app_config.get('version')
            inc_version = self._inc_version(version, stage)
            self.app_config['version'] = inc_version
            self._update_config_version(inc_version)

    def _inc_version(self, version, stage):
        parsed = version.split('.')
        parsedLen = len(parsed)
        stage = stage.lower()

        if (parsedLen != 4 and parsedLen != 3):
            raise Exception("项目%s中含有错误的版本号: %s" % (self.app_project, version))

        if (stage in ('test', 'ci') and parsedLen == 3):
            parsed.append('0')
        elif (stage == 'production' and parsedLen == 4):
            parsed = parsed[0:3]

        new_len = len(parsed)
        parsed[new_len - 1] = str(int(parsed[new_len - 1]) + 1)

        return '.'.join(parsed)

    def build_www(self):
        local('yarn install')
        local('npm run %s:app' % self.stage)

    def build_ios(self, export_method, configuration):
        '''
        args:
            export_method: 指定打包所使用的输出方式，目前支持app-store, package, ad-hoc, enterprise, development, 和developer-id
            configuration: 指定要打包的配置名, 如AdHoc(自建),Release
        '''

        local('cordova build ios --release --buildConfig=build/ios.build.json')

        app_name = self.app_config['name']

        workspace_file = "platforms/ios/{0}.xcworkspace".format(app_name)

        output_path = "build/ios"
        local("mkdir -p {0}".format(output_path))

        ipa_name = "{0}.ipa".format(app_name)

        # build
        params = {
            'workspace_file': workspace_file,
            'scheme': app_name,
            'configuration': configuration,
            'export_method': export_method,
            'output_path': output_path,
            'ipa_name': ipa_name,
        }
        package_command = "fastlane gym  -w {workspace_file} --scheme {scheme} --configuration {configuration}  --export_method {export_method} -o {output_path} -n {ipa_name} --xcargs \"-allowProvisioningUpdates\"".format(
            **params)

        local(
            package_command)

        with lcd(output_path):
            local('rm *.zip')

        self.ipa_path = "{0}/{1}".format(output_path, ipa_name)

        print 'Latest ios ipa file:', self.ipa_path,

    def build_android(self):
        output_path = 'platforms/android/app/build/outputs/apk/release'

        if os.path.exists(output_path):
            with lcd(output_path):
                local('rm -rf *')

        local('cordova build android --release')

        files = glob.glob(output_path + '/*-release.apk')
        # files = glob.glob(output_path + '/*.apk')
        fileCount = len(files)

        apk_path = None
        if (fileCount == 1):
            apk_path = files[0]
        elif (fileCount == 2):
            for file in files:
                if 'armv7' in file:
                    apk_path = file
                    break
        if apk_path is None:
            raise Exception('↑↑生成的apk数量错误↑↑')

        proj_en_name = self._get_en_app_name()
        new_apk_path = 'build/android/%s.apk' % proj_en_name
        local('mkdir -p build/android/')
        local('mv %s %s' % (apk_path, new_apk_path))
        self.apk_path = new_apk_path
        # self.apk_path = output_path + '/app-release-unsigned.apk'

        print 'Latest Android apk file:', self.apk_path,

    def _call_pgy_command(self, file_path):
        if not self.upload_accounts.has_key('pgy_api_key') or not self.upload_accounts.has_key('pgy_user_key'):
            raise Exception('蒲公英上传账号未正确配置: pgy_api_key, pgy_user_key')

        pgy_api_key = self.upload_accounts['pgy_api_key']
        pgy_user_key = self.upload_accounts['pgy_user_key']

        result = local(
            '''curl -F "file=@{file_path}" -F "uKey={pgy_user_key}" -F "_api_key={pgy_api_key}" http://www.pgyer.com/apiv1/app/upload'''.format(
                **{
                    'file_path': file_path,
                    'pgy_user_key': pgy_user_key,
                    'pgy_api_key': pgy_api_key,
                }), True)

        output = json.loads(result.stdout)
        if (output['code'] != 0):
            raise Exception('上传到蒲公英出错：' + output['message'])

        return 'https://www.pgyer.com/' + output['data']['appShortcutUrl']

    def _call_fir_command(self, file_path, api_token):
        result = local(
            "fir publish {file_path} --token={api_token}".format(
                **{
                    'file_path': file_path,
                    'api_token': api_token
                }), True)
        output = result.stdout
        # Published succeed: http://fir.im/wtr8

        search_result = re.search('Published succeed: http://([\w/.]+)', output, re.IGNORECASE)
        if search_result:
            url = search_result.group(1)
            return 'http://' + url

        return None

    def _upload_to_backend(self, file_path, platform, append_data={}):
        print 'uploading...\n'

        api_url = self._get_backend_url() + '/api/v1/client/apps'
        app_config = self.app_config

        # 服务器只同步两种状态
        upload_stage = "production" if self.stage == 'production' else "test"
        params = {
            'appId': app_config['id'],
            'appName': app_config['name'],
            'platform': platform.upper(),
            'stage': upload_stage.upper(),
            'version': app_config['version']
        }

        if (bool(append_data)):
            params = dict(params, **append_data)

        files = {'appFile': open(file_path, 'rb')}
        r = requests.post(api_url, files=files, data=params)

        resp = r.json()
        if (not resp['success']):
            raise Exception(resp['msg'])

    def upload_icon(self):
        api_url = self._get_backend_url() + '/api/app_icon'

        files = {'file': open('resources/icon.png', 'rb')}
        r = requests.post(api_url, files=files, data={'stage': self.stage.upper()})

        resp = r.json()
        if (not resp['success']):
            raise Exception(resp['msg'])

    def upload_ios(self, targets=('self', 'pgy'), itunes_app_id=None):
        # 上传到内部服务器
        if 'self' in targets:
            append_data = {}
            if (itunes_app_id is not None):
                append_data['ext.itunes_app_id'] = itunes_app_id
            file_path = self._decide_app_file('ios')
            self._upload_to_backend(file_path, 'ios', append_data)

        # # 上传到蒲公英服务
        if 'pgy' in targets:
            self._upload_to_pgy('ios')

    def upload_android(self, targets=('self', 'pgy')):
        # 上传到内部服务器
        if 'self' in targets:
            file_path = self._decide_app_file('android')
            self._upload_to_backend(file_path, 'android')

        # # 上传到蒲公英服务
        if 'pgy' in targets:
            self._upload_to_pgy('android')

    def _get_backend_url(self):
        with open(".env.%s" % self.stage) as f:
            lines = f.readlines()
            for line in lines:
                if ('VUE_APP_DATA_URL' not in line): continue

                search_result = re.search("VUE_APP_DATA_URL=(.+)", line, re.IGNORECASE)
                if search_result:
                    title = search_result.group(1)
                    return title

        return None

    def _parse_config_xml(self):
        root = ET.parse('config.xml').getroot()

        id = root.attrib['id']
        version = root.attrib['version']

        name = None
        for child in root:
            if (child.tag == '{http://www.w3.org/ns/widgets}name'):
                name = child.text
                break

        return {
            'id': id,
            'version': version,
            'name': name
        }

    def _decide_app_file(self, platform):
        file_path = None

        if (platform == 'ios'):
            file_path = self.ipa_path
        elif (platform == 'android'):
            file_path = self.apk_path
        else:
            raise Exception('平台参数错误, 只能为ios或者android')

        if (file_path is None or not os.path.exists(file_path)):
            raise Exception('找不到android apk文件，终止上传')

        return file_path

    def _upload_to_pgy(self, platform):
        '''
        上传到内侧平台蒲公英
        args:
            platform: ios, android
        '''
        file_path = self._decide_app_file(platform)

        return self._call_pgy_command(file_path)

    # def upload_to_fir(self, fir_token, platform):
    #     '''
    #     暂时使用fir做android正式版发布
    #     args:
    #         platform: ios, android
    #     '''
    #     file_path = self._decide_app_file(platform)
    #
    #     return self._call_fir_command(file_path, fir_token)

    def upload_ios_to_itunes(self, apple_dev_account):
        '''
        需要先在itunes connect创建版本，填写说明，上传截图等; 此步骤只是上传apk文件;

        args:
            apple_dev_account: 苹果开发者账号，一般为邮件地址
            app_id：在itunes connect创建好的app id
        '''

        file_path = self._decide_app_file('ios')

        local(
            '''fastlane deliver --ipa "{file_path}" -u "{apple_dev_account}" --skip_screenshots --submit_for_review '''.format(
                **{
                    'file_path': file_path,
                    'apple_dev_account': apple_dev_account
                }))

        # return '请至APP Store搜索: ' + self.app_name if app_id is None else 'https://itunes.apple.com/app/id' + app_id

    def set_crosswalk_mode(self, combine_apks=False):
        '''
        :param combine_apks: 启用crosswalk后，默认输出两个apk，分别针对arm和x86（如桌面虚拟机演示）cpu，特殊情况可设置合并（但会增大不少体积）
        '''

        target_line = 'cdvBuildMultipleApks=false'
        config_path = 'platforms/android/build-extras.gradle'
        if (not os.path.exists(config_path)):
            local('touch ' + config_path)

        with open(config_path) as f:
            lines = f.readlines()
            matchline = False
            for line in lines:
                if target_line in line:
                    matchline = True
                    break

        if (combine_apks and not matchline):
            local('echo %s>>%s' % (target_line, config_path))
        elif (not combine_apks and matchline):
            local("sed -i .bak 's/%s//g' %s" % (target_line, config_path))
            local("rm %s.bak" % config_path)

    def _get_en_app_name(self):
        # return ''.join(PinyinHelper.convertToPinyinFromSentence(self.app_config['name']))
        return self.app_config['name']

    def _update_config_version(self, new_version):
        import xml.etree.ElementTree as ET

        ET.register_namespace('cdv', 'http://cordova.apache.org/ns/1.0')
        ET.register_namespace('', 'http://www.w3.org/ns/widgets')

        tree = ET.parse('config.xml')
        root = tree.getroot()

        root.attrib['version'] = new_version
        root.attrib['xmlns:cdv'] = 'http://cordova.apache.org/ns/1.0'

        tree.write('config.xml', xml_declaration=True, encoding='utf-8', default_namespace='', method="xml")
