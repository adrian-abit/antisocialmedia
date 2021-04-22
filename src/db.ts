import { MongoClient, Db } from "mongodb";
import * as assert from "assert";
import { User } from "./user";

let connectionURL: string = "mongodb://localhost:27017";
let initialized: boolean = false;

var db!: Db;
const client: MongoClient = new MongoClient(connectionURL);

export function init() {
	client.connect((err) => {
		assert.strictEqual(null, err);
		console.log("Connected to Database");

		db = client.db("asm");
		initialized = true;
	});
}

export function getUser(
	un: string,
	saltedpassword: string,
	callback: (result: boolean, user?: User) => void
) {
	db.collection("auth").findOne(
		{ username: un, password: saltedpassword },
		(err, ret) => {
			if (err) {
				callback(false);
				throw err;
			}
			if (ret == null) callback(false);
			else
				callback(
					true,
					new User(ret.uid, ret.created, ret.posts, ret.comments)
				);
		}
	);
}

export function getSalt(
	un: string,
	callback: (b: boolean, salt?: string) => void
) {
	db.collection("auth").findOne({ username: un }, (err, ret) => {
		if (err) {
			callback(false);
			throw err;
		}
		if (ret == null) callback(false);
		else callback(true, ret.salt);
	});
}
