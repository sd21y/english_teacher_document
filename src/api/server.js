'use strict'

const express = require('express');
const mysql = require('mysql');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// CORSを許可する
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// DB connection
const connection = mysql.createConnection({
	host: 'localhost',
	user: '',
	password: '',
	database: 'english_teacher'
});

// DB connection Error handling
connection.connect((err) => {
	if (err) {
		console.log('error connecting: ' + err.stack);
		return;
	}
  	console.log('success');
});

// 大カテゴリ
app.get('/api/v1/english_teacher/category', (req, res) => {
	connection.query(
		'SELECT category.id, name_en, name_ja, image, color.color FROM category JOIN color on category.color_id = color.id',
		(error, results) => {
			if (error) {
				console.error(error);
				return;
			}
			res.send(results)
		}
	);
});

// 中カテゴリ
app.get('/api/v1/english_teacher/subcategory', (req, res) => {
	connection.query(
		'SELECT subcategory.id, subcategory.name_en, subcategory.name_ja, subcategory.image, category.name_en as category from subcategory JOIN category on subcategory.category_id = category.id',
		(error, results) => {
			res.send(results)
		}
	)
});

// 小カテゴリ
app.get('/api/v1/english_teacher/apps', (req, res) => {
	connection.query(
		'SELECT apps.id, apps.name_en, apps.name_ja, apps.image, apps.uuid, color.color, app_type.type, apps.category_id, apps.subcategory_id, category.name_en as category from apps JOIN color on apps.number_color_id = color.id JOIN app_type on apps.type_id = app_type.id JOIN category on apps.category_id = category.id ORDER BY display_order',
		(error, results) => {
			res.send(results)
		}
	)
});

// プロローグ / エピローグ
app.get('/api/v1/english_teacher/prologue_epilogue', (req, res) => {
	connection.query(
		`SELECT id, content, type FROM prologue_epilogue WHERE category_id=${req.query.category_id}`,
		(error, results) => {
			if (error) {
				res.send(error)
				console.log(error);
				return;
			}
			res.send(results)
		}

	)

});

// レッスンデータ
app.get('/api/v1/english_teacher/lesson/:id(\\d+)', (req, res) => {
	connection.query(
		`SELECT lesson.word from lesson where app_id = ${req.params.id}`,
		(error, results) => {
			if (error) {
				res.send(error)
				console.log(error);
				return;
			}
			res.send(results)
		}
		
	)
})


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
