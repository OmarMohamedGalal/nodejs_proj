const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dns = require("dns");
const Article = require("./models/Article");
dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

mongoose.connect("mongodb+srv://om435110_db_user:kJku7wFfsHjYCE7h@cluster0.o0sulez.mongodb.net/")
.then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log("Error connecting to MongoDB",err)
})
//om435110_db_user
//kJku7wFfsHjYCE7h
//mongodb+srv://<db_username>:kJku7wFfsHjYCE7h@cluster0.o0sulez.mongodb.net/
//mongodb+srv://om435110_db_user:kJku7wFfsHjYCE7h@cluster0.o0sulez.mongodb.net/
app.use(express.json());

app.get("/hello",(req,res)=>{
    res.send("Hello World")
})

app.get("/",(req,res)=>{
    res.send("Hello in my project")
})
app.get("/numbers",(req,res)=>{
    let numbers=""
    for(let i=0;i<100;i++){
        numbers+= i + " "
    }
    // res.sendFile(__dirname + "/views/numbers.html")
    res.render("numbers.ejs",{
        name:"Omar",
        numbers:numbers
    })
})
app.put("/test",(req,res)=>{
    res.send("This is a test route")
})

app.post("/addcomment",(req,res)=>{
    res.send("Comment added successfully")
});
app.delete("/delete",(req,res)=>{
    res.send("Comment deleted successfully")
});

app.get("/findSum/:num1/:num2",(req,res)=>{
    const num1=req.params.num1;
    const num2=req.params.num2;
    const sum=parseInt(num1)+parseInt(num2);
    console.log(req.params);
    res.send(`sum is ${sum}`)
})

app.get("/sayHello",(req,res)=>{
    // console.log(req.body);
    // console.log(req.query);
    // res.send(`Hello ${req.body.name}, Age: ${req.query.age}`)
    res.json({
        name: req.body.name,
        age: req.query.age,
        language:"Arabic",

    })
})
app.post("/articles",async(req,res)=>{
    const newArticle = new Article()
    const articleTitle = req.body.articleTitle;
    const articleBody = req.body.articleBody;
    const articleNumber = req.body.articleNumber;
    
    newArticle.title = articleTitle
    newArticle.body = articleBody
    newArticle.numberOfLikes = articleNumber

    await newArticle.save()
    res.json(newArticle)
});

app.get("/articles",async(req,res)=>{
    const articles = await Article.find();
    console.log("the articles are",articles);
    res.json(articles);
})

app.get("/articles/:articleId",async(req,res)=>{
    const id = req.params.articleId;
    try {
    const article = await Article.findById(id);
    res.json(article);
    return;
    }catch(error){
        console.log("error while reading article of id",id)
        return res.send(error)
    }
    
})

app.delete("/articles/:articleId",async(req,res)=>{
    const id = req.params.articleId;
    try {
        const article = await Article.findByIdAndDelete(id);
        res.json(article);
        return;
    } catch(error) {
        console.log("error while deleting article of id",id)
        return res.send(error)
    }
})
app.get("/showArticles",async(req,res)=>{
    const articles = await Article.find();
    res.render("articles.ejs",{
        articles:articles
    })
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})