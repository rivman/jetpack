/**
 * External Dependencies
 */
import React from 'react';

function jetpackGalleryImage( image ) {
	const href = image.link;
	const img = <img src={ image.url } alt={ image.alt } data-id={ image.id } data-link={ image.link } />;

	return (
		<li key={ image.id || image.url } className="blocks-gallery-item">
			<figure>
				{ href ? <a href={ href }>{ img }</a> : img }
				{ image.caption && image.caption.length > 0 && <figcaption>{ image.caption }</figcaption> }
			</figure>
		</li>
	);
}

export default jetpackGalleryImage;

