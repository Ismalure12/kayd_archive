const sanitizeHtml = require('sanitize-html');

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'strong', 'em', 'u', 's', 'del',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'a', 'img',
];

const ALLOWED_ATTRIBUTES = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'title'],
  '*': ['class'],
};

function sanitizeContent(html) {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
  });
}

module.exports = { sanitizeContent };
