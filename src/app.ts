import express from "express";
import { createPost } from "./posts";
import { v4 } from "uuid";
import * as api from "./api";
import * as caching from "./caching";
import * as path from "path";
import * as bodyParser from "body-parser";
import cookieParser = require("cookie-parser");
import { cookieAuth } from "./auth";
import exphbs = require("express-handlebars");
import * as db from "./db";
import * as auth from "./auth";

export module Static {
	export var devstatus: string = "preA";
	export var version: string = "0.0.1";
	export var identfifier: string = "afford amount split signal match murmur";
}

const app = express();

db.init();

/**
 * testing
 */
for (let i = 0; i < 100; i++) {
	caching.addPost(createPost(v4(), "" + i));
}

app.engine(
	"hbs",
	exphbs({
		extname: "hbs",
		layoutsDir: "./views/pages/",
		partialsDir: "./views/partials/"
	})
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "hbs");
app.set("views", path.join(path.resolve("."), "/views"));
auth.init(app);
api.init(app);

app.get("/login", cookieAuth, (req: any, res) => {
	if (req.asmuser != null) {
		res.redirect("/");
		return;
	}
	res.render("login", {
		stylesheet: ["login.css"]
	});
});

app.get("/", cookieAuth, (req: any, res) => {
	if (req.asmuser == null) res.redirect("/login");
	else
		res.render("homepage", {
			stylesheet: ["homepage.css"]
		});
});

app.listen(3000);
