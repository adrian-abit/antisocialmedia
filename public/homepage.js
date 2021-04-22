var crP = 0;

$(document).ready(()=> {

    /* Get content from backend */

    $.get("/api/posts?p=" + crP).done(data => {
        let postarray = data.posts;

        postarray.forEach(element => {
            console.log(element);
            let post = document.createElement("div");
            post.tabIndex = 0;
            post.classList.add("post");
            let hash = document.createElement("a");
            hash.classList.add("post-hash");
            hash.text = element.hash;
            let content = document.createElement("h1");
            content.classList.add("post-content");
            content.textContent = element["content"];
            let time = document.createElement("a");
            time.classList.add("post-time");
            let t = new Date(element.timestamp);
            time.text = t.toDateString() + " " + t.getHours() + ":" + t.getMinutes() + ":"
            + t.getSeconds() + ":" + t.getMilliseconds() + " GMT" + t.getTimezoneOffset() + "min";
            post.append(hash);
            post.append(content);
            post.append(time);

            document.getElementById("posts").append(post);
        });

    })

})

$("#more-button").on("click", () => {
    console.log("click");
    crP=crP+1;
    $.get("/api/posts?p=" + crP).done(data => {
        if(data.message != "success"){
            $("#more-button").hide();
            return;
        }
        let postarray = data.posts;

        postarray.forEach(element => {
            console.log(element);
            let post = document.createElement("div");
            post.tabIndex = 0;
            post.classList.add("post");
            let hash = document.createElement("a");
            hash.classList.add("post-hash");
            hash.text = element.hash;
            let content = document.createElement("h1");
            content.classList.add("post-content");
            content.textContent = element["content"];
            let time = document.createElement("a");
            time.classList.add("post-time");
            let t = new Date(element.timestamp);
            time.text = t.toDateString() + " " + t.getHours() + ":" + t.getMinutes() + ":"
            + t.getSeconds() + ":" + t.getMilliseconds() + " GMT" + t.getTimezoneOffset() + "min";
            post.append(hash);
            post.append(content);
            post.append(time);

            document.getElementById("posts").append(post);
        });

    })
})

