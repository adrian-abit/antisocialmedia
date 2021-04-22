import { SHA256 as sha, enc } from "crypto-js";

posts: new Map();

export class Post {
	readonly userid: string;
	readonly content: string;
	readonly hash: string;
	readonly timestamp: number;
	commentusers: string[];
	comments: Comment[];

	constructor(
		userid: string,
		timestamp: number,
		content: string,
		commentusers: string[],
		comments: Comment[]
	) {
		this.userid = userid;
		this.content = content;
		this.timestamp = timestamp;
		this.commentusers = commentusers;
		this.comments = comments;
		this.hash = sha(
			"asmcore-" + userid + timestamp + content + "-thankyou"
		).toString(enc.Hex);
	}
}

export class TrimmedPost {
	readonly hash: string;
	readonly commentlength: number;
	readonly content: string;
	readonly timestamp: number;

	constructor(
		hash: string,
		commentlength: number,
		content: string,
		timestamp: number
	) {
		this.hash = hash;
		this.commentlength = commentlength;
		this.content = content;
		this.timestamp = timestamp;
	}
}

export class Comment {
	readonly post: string;
	readonly userid: string;
	readonly content: string;
	readonly timestamp: number;
	readonly hash: string;

	constructor(
		post: string,
		userid: string,
		content: string,
		timestamp: number
	) {
		this.post = post;
		this.userid = userid;
		this.content = content;
		this.timestamp = timestamp;
		this.hash = sha(
			"asmcore-" + userid + timestamp + content + "-goodbye"
		).toString(enc.Hex);
	}
}

export function createPost(userid: string, content: string) {
	return new Post(userid, Date.now(), content, new Array(), new Array());
}

export function createComment(post: string, userid: string, content: string) {
	return new Comment(post, userid, content, Date.now());
}
