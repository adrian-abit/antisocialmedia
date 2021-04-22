import { SHA256 as sha, enc } from "crypto-js";

export class User {
	readonly userid: string;
	readonly timestamp: string;
	readonly hash: string;
	readonly posts: string[];
	readonly comments: string[];

	constructor(
		userid: string,
		timestamp: string,
		posts: string[],
		comments: string[]
	) {
		this.userid = userid;
		this.timestamp = timestamp;
		this.hash = sha("asmcore-" + userid + timestamp + "-welcome").toString(
			enc.Hex
		);
		this.posts = posts;
		this.comments = comments;
	}
}
