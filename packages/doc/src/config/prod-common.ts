import { Config } from "@tiger/service";
import { join } from "path";
import { LIB_DIR, PACKAGE_ENTRY, normalizePath } from "../common";
export default (api: Config, options: any) => {
	api.mode("production").entryPoints.clear().end().entry("tiger").clear().add(PACKAGE_ENTRY).end().output.path(LIB_DIR).filename("[name].min.js").chunkFilename("[id].js").publicPath("/").end();
	api.plugins.delete("html");
};
