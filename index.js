const express = require('express');
const mysql = require('mysql')

const app = express();

// 使用するファイルの収められているフォルダーを指定
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

// データベースへ接続
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kawabutairuka',
  database: 'list_app'
});

// 接続エラー発生時の処理
connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});


// トップ画面
app.get('/', (req, res) => {

  connection.query(
    'SELECT * FROM users',
    (error, results) => {
      console.log(results);
      res.render('top.ejs');
    }
  );
});


// 買い物リスト画面
app.get('/list', (req, res) => {

  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      console.log(results);
      console.log(results[0]);
      res.render('list.ejs', {items: results});
    }
  );

})

// ログイン画面
app.get('/login', (req, res) => {

  res.render('login.ejs');

});

// ユーザー名の照合
app.post('/signin', (req, res) => {

  const user = req.body.username
  console.log(user);

  connection.query(

    'SELECT name FROM users',

    (error, results)=>{

      results.forEach(element => {
        console.log(element.name);
        if(element.name == user){
          console.log('match!')
        }
      });

      res.redirect('/login');
    }
  );

});


// ユーザーの新規登録
app.get('/signup', (req, res) => {

  res.render('signup.ejs');

});

app.post('/newuser', (req, res)=>{

  console.log(req.body.username);

  connection.query(
    'INSERT INTO users (name) VALUES (?)',
    [req.body.username],
    (error, results)=>{
      res.redirect('/signup');
    }
  );

});


app.listen(3000);
