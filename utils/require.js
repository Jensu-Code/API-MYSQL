import { createRequire} from "node:module";
export function readJson(path){
   const require = createRequire(import.meta.url); 
   return require(path);
}