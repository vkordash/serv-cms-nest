
export function getSrc(src:string, SiteUrl:any){
        
        if (src.substr(0,2)=="./") {
            return  SiteUrl+src.substr(2); 
        }

        return 'http://192.168.77.253/test_docs/nest/nest_cms/src/'+src;
    }