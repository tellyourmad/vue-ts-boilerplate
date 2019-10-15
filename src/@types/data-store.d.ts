import Vue from "vue"
declare module "vue/types/vue" {
  interface Vue {
    $dataStore: StoreJsAPI
    [x: string]: any;
  }
}
