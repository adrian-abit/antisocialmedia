import { Express, NextFunction } from "express";
import { addUser, getUser, removeUser } from "./caching";
import { getSalt, getUser as getDBUser } from "./db";

var sessions: Map<string, string> = new Map();

function makeid(length: number) {
	let result = "";
	let characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}
	return result;
}

export function init(app: Express) {
	app.post("/auth/login", cookieAuth, (req: any, res) => {
		if (req.asmuser != null) {
			res.send({ message: "already authenticated" });
			return;
		}

		let username: string = req.body.u;
		let password: string = req.body.spw;

		if (username != null && password == null) {
			getSalt(username, (ret, salt) => {
				if (ret) res.send({ result: true, msg: salt });
				else res.send({ result: false, msg: "couldn't sign in" });
			});
		} else if (username != null && password != null) {
			getDBUser(username, password, (ret, user) => {
				if (ret) {
					let sessid = makeid(64);
					sessions.set(sessid, req.asmid);
					addUser(sessid, user!);
					res.cookie("sessid", sessid, {
						maxAge: 604800,
						httpOnly: true
					});
					res.send({ result: true });
				} else res.send({ result: false, msg: "couldn't sign in" });
			});
		} else {
			res.send({ result: false, msg: "malformed request" });
		}
	});
}

export function logout(res: any, sessid: string) {
	res.cookie("sessid", "deletus expirus", { maxAge: 0, httpOnly: true });
	sessions.delete(sessid);
	removeUser(sessid);
}

export function validate(sessid: string, asmid: string) {
	if (sessid == null || sessid.length != 64) return false;
	if (sessions.get(sessid) == asmid) {
		if (getUser(sessid) != null) return true;
	} else return false;
}

export function cookieAuth(req: any, res: any, next: NextFunction) {
	let cookies: any = req.cookies;
	let asmid: string = cookies["asmid"];
	let sessid: string = cookies["sessid"];

	if (asmid == null || asmid.length != 32)
		res.cookie("asmid", makeid(32), { maxAge: 2147483647, httpOnly: true });
	req.asmid = asmid;
	req.sessid = sessid;
	if (validate(sessid, asmid)) req.asmuser = getUser(sessid);
	else if (sessid == null) {
		next();
		return;
	} else logout(res, sessid);
	next();
}
