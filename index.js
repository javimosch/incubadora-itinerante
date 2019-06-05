var getLastNews = async function() {
	return {
		name: 'new 1'
	}
}
var currentLocation = {
	text: "Buenos Aires, Argentina",
	coords: [-34.5873781, -58.4334792],
	zoom: 8
};

var builder = require('./builder');

(async() => {


	await builder.transformFile({
		target: '/index.html',
		source: "src/templates/home.pug",
		mode: 'pug',
		context: {
			lastNews: await getLastNews(),
			currentLocation
		}
	})

	await builder.transformFile({
		target: '/donde-estamos/index.html',
		source: "src/templates/donde-estamos.pug",
		mode: 'pug',
		context: {
			currentLocation
		}
	})

	await builder.transformFile({
		target: '/politica-de-privacidad/index.html',
		source: "src/templates/politica-de-privacidad.pug",
		mode: 'pug',
		context: {}
	})

	await builder.transformFile({
		target: '/red-voluntarios/index.html',
		source: "src/templates/red-voluntarios.pug",
		mode: 'pug',
		context: {
			metaTitle: "Red de voluntarios en Latinoamerica - Proyectos sociales y ambientales"
		}
	})

	await builder.transformFile({
		target: '/como-podemos-ayudar/index.html',
		source: "src/templates/como-podemos-ayudar.pug",
		mode: 'pug',
		context: {}
	})

	await builder.transformFile({
		target: '/recursos/index.html',
		source: "src/templates/recursos.pug",
		mode: 'pug',
		context: {}
	})

	var db = require('./src/database');
	var articles = await db.getArticles();

	await builder.transformFile({
		target: '/proyectos-visitados/index.html',
		source: "src/templates/proyectos-visitados.pug",
		mode: 'pug',
		context: {
			items: articles
		}
	});

	await Promise.all(articles.map(article => {
		return (async() => {
			await builder.transformFile({
				target: `${article.publicUrl||'/'+article.name}/index.html`,
				source: 'src/templates/article.pug',
				mode: 'pug',
				context: {
					item: article
				}
			});
		})();
	}))

	await builder.transformFile({
		target: '/css/styles.css',
		source: "src/styles.css",
		mode: 'scss'
	})

	await builder.transformFile({
		target: '/js/common.js',
		source: "src/js/common.js",
		mode: 'js'
	})

	console.log('builder done')

})();