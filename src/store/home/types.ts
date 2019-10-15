import { IHome } from "@/http/api/home/home.interface";
export interface HomeState {
    version: string;
    homeProduct?: IHome;
}
