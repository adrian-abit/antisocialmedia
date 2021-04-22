import { Express } from "express";
import { getPages, getTrimmedPosts } from "./caching";
import { Static } from "./app";
import { cookieAuth } from "./auth";
var app!: Express;
var initialized: boolean = false;

function invalid(res: any) {
	res.setHeader("asm-core.version", Static.version);
	res.setHeader("asm-core.identifier", Static.identfifier);
	res.setHeader("asm-core.status", "failure");
	res.send({ message: "failure", error: "invalid request" });
}

export function init(express: Express) {
	if (express.get != null) {
		app = express;
		initialized = true;

		app.get("/api/posts", cookieAuth, (req: any, res) => {
			if (req.asmuser == null) {
				res.send({ message: "failure", error: "not authenticated" });
				return;
			}

			let min = 0;
			if (req.query.p != null) {
				let query: number = Number(req.query.p);
				if (isNaN(query) || query < 0) invalid(res);
				else {
					if (query > getPages(25)) {
						res.send({
							message: "EoD",
							error: "invalid request"
						});
						return;
					}

					res.setHeader("asm-core.version", Static.version);
					res.setHeader("asm-core.identifier", Static.identfifier);
					res.setHeader("asm-core.status", "success");

					let start = query * 25;
					let end = query * 25 + 24;

					if (start == 0) end = 24;

					let response = {
						message: "success",
						posts: getTrimmedPosts(start, end)
					};

					res.send(response);
				}
			} else invalid(res);
		});
	} else throw new Error("Not passed a valid express object");
}
