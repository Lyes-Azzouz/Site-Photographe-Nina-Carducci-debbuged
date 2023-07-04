(function ($) {
  $.fn.mauGallery = function (options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function () {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function (index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true,
  };

  $.fn.mauGallery.listeners = function (options) {
    $(".gallery-item").on("click", function () {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };

  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        if (columns.sm)
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        if (columns.md)
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        if (columns.lg)
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        if (columns.xl)
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },

    // REGLAGE DU PROBLEME DE CAROUSEL DANS LA GALLERY DE L'IMAGE , UTILISATION DE ".lightboxImage" POUR CIBLER L'IMAGE PRESENTE DANS LA MODALE POUR PASSER D'UNE IMAGE A UNE AUTRE
    nextImage() {
      const activeImage = $(".lightboxImage"); // Utilisation de lightboxImage pour séléctionner l'image affichée dans la modale au lieu de ".gallery-item img" qui fais référence a "img" dans "gallery"
      const activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      const imagesCollection = [];

      if (activeTag === "all") {
        $(".item-column").each(function () {
          const imageReference = $(this).children("img"); // Mise en place d'une variable "imageReference" afin de stocker la référence de l'image ce qui permet d'éviter de chercher à chaque fois l'image de manière répétée
          if (imageReference.length) {
            imagesCollection.push(imageReference); // On push l'image dans le tableau
          }
        });
      } else {
        $(".item-column").each(function () {
          // Stock référence élement enfant (img) dans la variable imageReference
          const imageReference = $(this).children("img");
          // Vérification de la valeur de l'attribut "data-gallery-tag" afin de voir si  l'image correspond à "activeTag" : activeTag = $(".tags-bar span.active-tag").data("images-toggle");
          if (imageReference.data("gallery-tag") === activeTag) {
            // On push l'élément (img) dans le tableau
            imagesCollection.push(imageReference);
          }
        });
      }

      const index = imagesCollection.findIndex(
        (el) => $(activeImage).attr("src") === $(el).attr("src")
      );
      const next = imagesCollection[index + 1] || imagesCollection[0]; // Modification de l'obtention des index pour les images (ici on utilise index  + 1 pour cibler l'image suivante lorsque l'on clique sur la flêche de droite)
      $(".lightboxImage").attr("src", $(next).attr("src")); // Cette modification permet de passer d'une image à l'autre dans le tableau de "imageCollection" grâce aux index (+1 car ici on cherche l'image suivante du carousel)
    },

    prevImage() {
      const activeImage = $(".lightboxImage"); // Utilisation de lightboxImage pour séléctionner l'image affichée dans la modale au lieu de ".gallery-item img" qui fais référence a "img" dans "gallery"
      const activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      const imagesCollection = [];

      if (activeTag === "all") {
        $(".item-column").each(function () {
          const imageReference = $(this).children("img"); // Mise en place d'une variable "imageReference" afin de stocker la référence de l'image ce qui permet d'éviter de chercher à chaque fois l'image de manière répétée
          if (imageReference.length) {
            imagesCollection.push(imageReference); // On push l'image dans le tableau
          }
        });
      } else {
        $(".item-column").each(function () {
          // Stock référence élement enfant (img) dans la variable imageReference
          const imageReference = $(this).children("img");
          // Vérification de la valeur de l'attribut "data-gallery-tag" afin de voir si  l'image correspond à "activeTag" : activeTag = $(".tags-bar span.active-tag").data("images-toggle");
          if (imageReference.data("gallery-tag") === activeTag) {
            // On push l'élément (img) dans le tableau
            imagesCollection.push(imageReference);
          }
        });
      }

      const index = imagesCollection.findIndex(
        (el) => $(activeImage).attr("src") === $(el).attr("src")
      );
      const prev = // Modification de l'obtention des index pour les images (ici on utilise index - 1 pour cibler l'image précèdente lorsque l'on clique sur la flêche de gauche)
        imagesCollection[index - 1] ||
        imagesCollection[imagesCollection.length - 1];
      $(".lightboxImage").attr("src", $(prev).attr("src")); // Cette modification permet de passer d'une image à l'autre dans le tableau de "imageCollection" grâce aux index (-1 car ici on cherche l'image précèdente du carousel)
    },
    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
      }" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content " style = "width : 400px">
              <div class="modal-body">
                ${
                  navigation
                    ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                    : '<span style="display:none;" />'
                }
                <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                ${
                  navigation
                    ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                    : '<span style="display:none;" />'
                }
              </div>
            </div>
          </div>s
        </div>`);
    },
    showItemTags(gallery, position, tags) {
      let tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';

      $.each(tags, function (index, value) {
        // let activeClass = index === 0 ? 'active' : ''; // ajout de la classe active uniquement au premier (0)
        tagItems += `<li class="nav-item">
          <span class="nav-link" data-images-toggle="${value}">${value}</span></li>`;
      });

      $(document).on("click", ".nav-link", function () {
        $(".nav-link").removeClass("active"); // Supprime de la classe "active" pour tous les éléments
        $(this).addClass("active"); // ajout de la classe "active" à l'élément séléctionné
      });

      const tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },
    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }

      $(".active-tag").removeClass("active active-tag");
      $(this).addClass("active-tag");

      const tag = $(this).data("images-toggle");

      $(".gallery-item").each(function () {
        $(this).parents(".item-column").hide();

        if (tag === "all") {
          $(this).parents(".item-column").show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this).parents(".item-column").show(300);
        }
      });
    },
  };
})(jQuery);
