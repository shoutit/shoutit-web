/**
 * Created by Philip on 27.02.2015.
 */
var path = require('path'),
    url = require('url');

function augmentImages(images) {
    return images.map(function(imgUrl) {

        return {
            original: getImgVariant(imgUrl, 'large'),
            thumbnail: getImgVariant(imgUrl, 'small')
        }
    });
}

function getImgVariant(imgUrl, size) {
    var urlObj = url.parse(imgUrl),
        name = urlObj.pathname,
        ext = path.extname(name);

    urlObj.pathname = path.basename(name, ext) + "_" + size + ext;
    return url.format(urlObj);
}

module.exports = function (client) {
	return function (req, res) {
		client.get(req.session, req.params.id)
			.on('success', function (data) {
				data.images = augmentImages(data.images);
				res.json(data);
			})
			.on('fail', function (data, resp) {
				res.status(resp.statusCode).json(data);
			})
			.on('error', function (err) {
				console.error(err);
				res.status(500).send(err);
			});
	}
};
