import { TrimmedPost, Post, Comment } from "./posts";
import { User } from "./user";

var posts: Map<string, Post> = new Map<string, Post>();
var posthashes: Array<string> = new Array<string>();
var users: Map<string, User> = new Map<string, User>();

export function getUser(sessid: string) {
	return users.get(sessid);
}

export function removeUser(sessid: string) {
	users.delete(sessid);
}

export function addUser(sessid: string, user: User) {
	if (users.size > 200) {
		var keys = Array.from(users.keys()).slice(0, 5);
		keys.forEach((k) => users.delete(k));
	}
	users.set(sessid, user);
}

export function addPost(post: Post) {
	if (posts.get(post.hash) == null) {
		posts.set(post.hash, post);
		posthashes.push(post.hash);
	} else throw new Error("Tried to add same post twice! --> " + post);
}

export function getPost(hash: string) {
	return posts.get(hash);
}

export function getPages(entries: number) {
	return Math.ceil(posts.size / entries) - 1;
}

export function getTrimmedPosts(offset: number, max: number) {
	let returnposts: Array<TrimmedPost> = new Array<TrimmedPost>();

	for (let i: number = offset; i <= max; i++) {
		let posthash: string = posthashes[i];
		if (posthash == null) break;

		let post = posts.get(posthash)!;
		returnposts.push(
			new TrimmedPost(
				post.hash,
				post.comments.length,
				post.content,
				post.timestamp
			)
		);
	}

	return returnposts;
}
