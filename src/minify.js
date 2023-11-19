const cheerio = require("cheerio");
const minify = require("html-minifier").minify;
const {
  elementsToRemove,
  attributesToRemove,
  elementsToMapWithAriaRoles,
} = require("./constants");

function getTextForIntent(html) {
  // Minify the HTML
  let simplifiedHTML = minify(html, {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true,
    removeOptionalTags: true,
  });

  const $ = cheerio.load(simplifiedHTML);

  $("*:empty").remove();
  // Remove uninteresting elements
  elementsToRemove.forEach((element) => {
    $(element).remove();
  });

  // Map elements to their ARIA roles
  Object.keys(elementsToMapWithAriaRoles).forEach((tag) => {
    $(tag).each(function () {
      const element = $(this);
      element.replaceWith(
        `<div role="${elementsToMapWithAriaRoles[tag]}">${element.html()}</div>`
      );
    });
  });

  // Remove uninteresting attributes
  $("*").each(function () {
    const element = $(this);
    attributesToRemove.forEach((attribute) => {
      element.removeAttr(attribute);
    });

    const attributes = element.attr();
    if (attributes) {
      Object.keys(attributes).forEach((attribute) => {
        if (attribute.startsWith("data-") || attribute.startsWith("aria-")) {
          element.removeAttr(attribute);
        }
      });
    }
  });

  // Extract the text
  const text = $("body").text();
  return text;
}

module.exports = getTextForIntent;
