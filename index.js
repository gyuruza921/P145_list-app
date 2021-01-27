const express = require('express');
const mysql = require('mysql')

const app = express();

// 使用するファイルの収められているフォルダーを指定
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

// データベースへ接続
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'list',
  password: 'haitsun',
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


// 買い物リスト画面
app.get('/list', (req, res) => {

  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      console.log(results);
      // console.log(results[0]);
      res.render('list.ejs', {items: results});
    }
  );

});

// 買い物リストの追加
app.post('/add', (req, res) => {

  console.log(req.body.item);

  connection.query(
    'INSERT INTO items (name) VALUES (?)',
    [req.body.item],
      res.redirect('/list')
  );

});

// 買い物リストの削除
app.get('/delete', (req, res) => {

  console.log("id" + req.query.id);

  // データベースから指定された行を削除
  connection.query(
    'DELETE FROM items WHERE id = ? ',
    [req.query.id],
    res.redirect('/list')
  );

});

// 買い物リストの編集
app.get('/edit', (req, res) => {

  console.log("id" + req.query.id);

  // データベースの指定された行を編集
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      console.log(results);
      res.render('edit.ejs', {items: results, id: req.query.id});
    }
  );

});

// 買い物リストの更新
app.post('/update', (req, res) => {

  console.log(req.body);

  // データの更新
  connection.query(
    'UPDATE items SET name = ? WHERE id = ?',
    [req.body.item, req.body.id],
    res.redirect('/list')
  );

});


app.listen(3000);
