/* ── Section Builder — Trail Event Theme ──────────────────────────────── */
jQuery(function($) {

  var $list  = $('#trail-sections-list');
  var $input = $('#trail-sections-data');
  var $builder = $('#trail-section-builder');
  var sections = [];

  try { sections = JSON.parse($builder.data('sections') || '[]'); } catch(e) { sections = []; }

  /* ── Gabarits HTML par type ────────────────────────────────────────── */
  var templates = {

    texte: function(s) {
      return tpl('📝 Texte / Contenu', s, `
        <label>Titre du bloc</label>
        <input type="text" name="titre" value="${esc(s.titre)}" placeholder="Ex: À propos de l'épreuve">
        <label>Contenu <small>(retour à la ligne = nouveau paragraphe)</small></label>
        <textarea name="contenu" rows="8">${esc(s.contenu)}</textarea>
        <hr>
        <label>Bouton (optionnel)</label>
        <input type="text" name="bouton_label" value="${esc(s.bouton_label)}" placeholder="Texte du bouton">
        <input type="url"  name="bouton_url"   value="${esc(s.bouton_url)}"   placeholder="URL du bouton">
        <label class="inline"><input type="checkbox" name="bouton_externe" ${s.bouton_externe?'checked':''}>Ouvrir dans un nouvel onglet</label>
      `);
    },

    programme: function(s) {
      return tpl('📅 Programme', s, `
        <label>Titre</label>
        <input type="text" name="titre" value="${esc(s.titre)}" placeholder="Le Programme">
        <label>Contenu du programme</label>
        <textarea name="contenu" rows="10">${esc(s.contenu)}</textarea>
        <label>Image de fond</label>
        <div class="media-field" data-field="image">
          ${mediaPreview(s.image)}
          <button type="button" class="button pick-media">Choisir une image</button>
          <input type="hidden" name="image" value="${esc(s.image)}">
        </div>
      `);
    },

    epreuves: function(s) {
      var list = (s.epreuves || []).map(function(ep, i) {
        return `<div class="trail-epreuve" data-index="${i}">
          <div class="epreuve-header">
            <strong>${esc(ep.nom) || 'Épreuve ' + (i+1)}</strong>
            <button type="button" class="trail-btn-remove-ep">✕</button>
          </div>
          <input type="text" name="ep_nom"   value="${esc(ep.nom)}"    placeholder="Nom de l'épreuve">
          <div class="two-col">
            <div><label>Distance</label><input type="text" name="ep_distance" value="${esc(ep.distance)}" placeholder="42 km"></div>
            <div><label>Dénivelé</label><input type="text" name="ep_denivele" value="${esc(ep.denivele)}" placeholder="+1200 m"></div>
            <div><label>Heure départ</label><input type="text" name="ep_depart" value="${esc(ep.depart)}" placeholder="19h30"></div>
          </div>
          <label>Description courte</label>
          <textarea name="ep_description" rows="2">${esc(ep.description)}</textarea>
          <label>Lien inscription</label>
          <input type="url" name="ep_inscription" value="${esc(ep.lien_inscription)}" placeholder="https://...">
          <label>Photo principale</label>
          <div class="media-field" data-field="ep_image">
            ${mediaPreview(ep.image)}
            <button type="button" class="button pick-media">Choisir une image</button>
            <input type="hidden" name="ep_image" value="${esc(ep.image)}">
          </div>
        </div>`;
      }).join('');
      return tpl('🏃 Épreuves', s, `
        <label>Titre de la section</label>
        <input type="text" name="titre" value="${esc(s.titre)}" placeholder="Les épreuves">
        <div class="trail-epreuves-list">${list}</div>
        <button type="button" class="button trail-add-epreuve">+ Ajouter une épreuve</button>
      `);
    },

    galerie: function(s) {
      var photos = (s.photos || []).map(function(p, i) {
        var url = typeof p.image === 'number' ? '' : (p.image || '');
        var id  = typeof p.image === 'number' ? p.image : '';
        return `<div class="galerie-photo">
          ${id || url ? `<img src="${id ? wp.media.attachment(id).get('url') || '' : url}" style="height:60px;object-fit:cover;border-radius:4px">` : ''}
          <input type="hidden" name="photo_img" value="${esc(p.image)}">
          <input type="text" name="photo_legende" value="${esc(p.legende)}" placeholder="Légende (optionnel)">
          <button type="button" class="trail-btn-remove-photo">✕</button>
        </div>`;
      }).join('');
      return tpl('🖼️ Galerie photos', s, `
        <label>Titre</label>
        <input type="text" name="titre" value="${esc(s.titre)}" placeholder="Galerie">
        <div class="galerie-photos-list">${photos}</div>
        <div class="media-field" data-field="new_photo">
          <button type="button" class="button trail-add-photo">+ Ajouter une photo</button>
          <input type="hidden" name="new_photo" value="">
        </div>
      `);
    },

    partenaires: function(s) {
      var list = (s.partenaires || []).map(function(p,i) {
        return `<div class="trail-partenaire">
          <input type="text" name="p_nom" value="${esc(p.nom)}" placeholder="Nom du partenaire">
          <input type="url"  name="p_url" value="${esc(p.url)}" placeholder="Site web">
          <div class="media-field" data-field="p_logo">
            ${mediaPreview(p.logo)}
            <button type="button" class="button pick-media">Logo</button>
            <input type="hidden" name="p_logo" value="${esc(p.logo)}">
          </div>
          <button type="button" class="trail-btn-remove-p">✕</button>
        </div>`;
      }).join('');
      return tpl('🤝 Partenaires', s, `
        <label>Titre</label>
        <input type="text" name="titre" value="${esc(s.titre)}" placeholder="Nos partenaires">
        <label>Description</label>
        <textarea name="description" rows="2">${esc(s.description)}</textarea>
        <div class="trail-partenaires-list">${list}</div>
        <button type="button" class="button trail-add-partenaire">+ Ajouter un partenaire</button>
      `);
    },

    contact: function(s) {
      return tpl('📞 Contact', s, `
        <label>Titre</label>
        <input type="text" name="titre" value="${esc(s.titre)}" placeholder="Contactez-nous">
        <label>Email de contact</label>
        <input type="email" name="email" value="${esc(s.email)}" placeholder="contact@trail.fr">
        <label>Téléphone</label>
        <input type="tel" name="telephone" value="${esc(s.telephone)}">
        <label>Adresse</label>
        <textarea name="adresse" rows="2">${esc(s.adresse)}</textarea>
        <label>Texte intro (au-dessus du formulaire)</label>
        <textarea name="texte_intro" rows="2">${esc(s.texte_intro)}</textarea>
      `);
    },

    benevoles: function(s) {
      return tpl('🙋 Bénévoles', s, `
        <label>Titre</label>
        <input type="text" name="titre" value="${esc(s.titre)}" placeholder="Devenir bénévole">
        <label>Description</label>
        <textarea name="description" rows="5">${esc(s.description)}</textarea>
        <label>Lien inscription bénévoles</label>
        <input type="url" name="lien_inscription" value="${esc(s.lien_inscription)}" placeholder="https://...">
        <label>Photo</label>
        <div class="media-field" data-field="image">
          ${mediaPreview(s.image)}
          <button type="button" class="button pick-media">Choisir une image</button>
          <input type="hidden" name="image" value="${esc(s.image)}">
        </div>
      `);
    },

    compteur: function(s) {
      return tpl('⏱️ Compte à rebours', s, `
        <label>Titre</label>
        <input type="text" name="titre" value="${esc(s.titre)}" placeholder="Prochaine édition">
        <label>Date et heure de départ</label>
        <input type="datetime-local" name="date" value="${esc(s.date ? s.date.slice(0,16) : '')}">
      `);
    },

    resultats: function(s) {
      var list = (s.annees || []).map(function(a,i) {
        return `<div class="trail-resultat">
          <input type="text" name="r_annee" value="${esc(a.annee)}" placeholder="2025" style="width:80px">
          <input type="url"  name="r_lien"  value="${esc(a.lien)}"  placeholder="URL des résultats" style="flex:1">
          <button type="button" class="trail-btn-remove-r">✕</button>
        </div>`;
      }).join('');
      return tpl('🏆 Résultats', s, `
        <label>Titre</label>
        <input type="text" name="titre" value="${esc(s.titre)}" placeholder="Résultats">
        <div class="trail-resultats-list">${list}</div>
        <button type="button" class="button trail-add-resultat">+ Ajouter une année</button>
      `);
    },

    photos: function(s) {
      var list = (s.annees || []).map(function(a,i) {
        return `<div class="trail-album">
          <input type="text" name="a_annee" value="${esc(a.annee)}" placeholder="2025" style="width:80px">
          <input type="url"  name="a_lien"  value="${esc(a.lien)}"  placeholder="Lien album" style="flex:1">
          <div class="media-field" data-field="a_image">
            ${mediaPreview(a.image)}
            <button type="button" class="button pick-media">Image</button>
            <input type="hidden" name="a_image" value="${esc(a.image)}">
          </div>
          <button type="button" class="trail-btn-remove-a">✕</button>
        </div>`;
      }).join('');
      return tpl('📷 Photos par année', s, `
        <label>Titre</label>
        <input type="text" name="titre" value="${esc(s.titre)}" placeholder="Photos">
        <div class="trail-albums-list">${list}</div>
        <button type="button" class="button trail-add-album">+ Ajouter un album</button>
      `);
    },
  };

  /* ── Helper : génère un bloc de section ─────────────────────────────── */
  function tpl(label, s, inner) {
    return `<div class="trail-section" data-type="${s.type}">
      <div class="trail-section-header">
        <span class="trail-drag-handle">⠿</span>
        <strong>${label}</strong>
        <span class="trail-section-actions">
          <button type="button" class="trail-toggle-btn">▾</button>
          <button type="button" class="trail-remove-btn button-link-delete">Supprimer</button>
        </span>
      </div>
      <div class="trail-section-body">${inner}</div>
    </div>`;
  }

  function esc(v) { return String(v || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function mediaPreview(val) {
    if (!val) return '';
    if (typeof val === 'number') return `<img class="media-preview" data-id="${val}" style="height:50px;border-radius:4px">`;
    return `<img class="media-preview" src="${val}" style="height:50px;border-radius:4px">`;
  }

  /* ── Rendu initial ──────────────────────────────────────────────────── */
  function render() {
    $list.empty();
    sections.forEach(function(s, i) {
      if (templates[s.type]) {
        $list.append($(templates[s.type](s)).data('index', i));
      }
    });
    bindEvents();
  }

  /* ── Sérialiser les sections ────────────────────────────────────────── */
  function serialize() {
    var data = [];
    $list.find('.trail-section').each(function() {
      var $s    = $(this);
      var type  = $s.data('type');
      var obj   = { type: type };

      // Champs simples
      $s.find('[name="titre"]').each(function() { obj.titre = $(this).val(); });
      $s.find('[name="contenu"]').each(function() { obj.contenu = $(this).val(); });
      $s.find('[name="description"]').each(function() { obj.description = $(this).val(); });
      $s.find('[name="image"]').each(function() { var v = $(this).val(); if(v) obj.image = isNaN(v) ? v : parseInt(v); });
      $s.find('[name="email"]').each(function() { obj.email = $(this).val(); });
      $s.find('[name="telephone"]').each(function() { obj.telephone = $(this).val(); });
      $s.find('[name="adresse"]').each(function() { obj.adresse = $(this).val(); });
      $s.find('[name="texte_intro"]').each(function() { obj.texte_intro = $(this).val(); });
      $s.find('[name="lien_inscription"]').each(function() { obj.lien_inscription = $(this).val(); });
      $s.find('[name="bouton_label"]').each(function() { obj.bouton_label = $(this).val(); });
      $s.find('[name="bouton_url"]').each(function() { obj.bouton_url = $(this).val(); });
      $s.find('[name="bouton_externe"]').each(function() { obj.bouton_externe = $(this).is(':checked'); });
      $s.find('[name="date"]').each(function() { obj.date = $(this).val(); });

      // Épreuves
      if (type === 'epreuves') {
        obj.epreuves = [];
        $s.find('.trail-epreuve').each(function() {
          var $ep = $(this);
          var img = $ep.find('[name="ep_image"]').val();
          obj.epreuves.push({
            nom: $ep.find('[name="ep_nom"]').val(),
            distance: $ep.find('[name="ep_distance"]').val(),
            denivele: $ep.find('[name="ep_denivele"]').val(),
            depart: $ep.find('[name="ep_depart"]').val(),
            description: $ep.find('[name="ep_description"]').val(),
            lien_inscription: $ep.find('[name="ep_inscription"]').val(),
            image: img ? (isNaN(img) ? img : parseInt(img)) : ''
          });
        });
      }

      // Partenaires
      if (type === 'partenaires') {
        obj.partenaires = [];
        $s.find('.trail-partenaire').each(function() {
          var $p = $(this);
          var logo = $p.find('[name="p_logo"]').val();
          obj.partenaires.push({ nom: $p.find('[name="p_nom"]').val(), url: $p.find('[name="p_url"]').val(), logo: logo ? (isNaN(logo) ? logo : parseInt(logo)) : '' });
        });
      }

      // Résultats
      if (type === 'resultats') {
        obj.annees = [];
        $s.find('.trail-resultat').each(function() {
          obj.annees.push({ annee: $(this).find('[name="r_annee"]').val(), lien: $(this).find('[name="r_lien"]').val() });
        });
      }

      // Photos / Albums
      if (type === 'photos') {
        obj.annees = [];
        $s.find('.trail-album').each(function() {
          var img = $(this).find('[name="a_image"]').val();
          obj.annees.push({ annee: $(this).find('[name="a_annee"]').val(), lien: $(this).find('[name="a_lien"]').val(), image: img ? (isNaN(img) ? img : parseInt(img)) : '' });
        });
      }

      // Galerie
      if (type === 'galerie') {
        obj.photos = [];
        $s.find('.galerie-photo').each(function() {
          var img = $(this).find('[name="photo_img"]').val();
          obj.photos.push({ image: img ? (isNaN(img) ? img : parseInt(img)) : '', legende: $(this).find('[name="photo_legende"]').val() });
        });
      }

      data.push(obj);
    });
    $input.val(JSON.stringify(data));
  }

  /* ── Événements ─────────────────────────────────────────────────────── */
  function bindEvents() {

    // Collapse/expand
    $list.find('.trail-toggle-btn').off('click').on('click', function() {
      var $body = $(this).closest('.trail-section').find('.trail-section-body');
      $body.toggle();
      $(this).text($body.is(':visible') ? '▾' : '▸');
    });

    // Supprimer section
    $list.find('.trail-remove-btn').off('click').on('click', function() {
      if (!confirm('Supprimer cette section ?')) return;
      $(this).closest('.trail-section').remove();
      serialize();
    });

    // Sélecteur de médias
    $list.find('.pick-media').off('click').on('click', function() {
      var $field = $(this).closest('.media-field');
      var frame = wp.media({ title: 'Choisir une image', button: { text: 'Utiliser' }, multiple: false, library: { type: 'image' } });
      frame.on('select', function() {
        var att = frame.state().get('selection').first().toJSON();
        $field.find('input[type="hidden"]').val(att.id);
        var prev = $field.find('.media-preview');
        if (prev.length) { prev.attr('src', att.url); } else { $field.prepend('<img class="media-preview" src="' + att.url + '" style="height:50px;border-radius:4px;display:block;margin-bottom:6px">'); }
      });
      frame.open();
    });

    // Ajouter épreuve
    $list.find('.trail-add-epreuve').off('click').on('click', function() {
      var $container = $(this).prev('.trail-epreuves-list');
      var i = $container.find('.trail-epreuve').length;
      $container.append(`<div class="trail-epreuve" data-index="${i}">
        <div class="epreuve-header"><strong>Nouvelle épreuve</strong><button type="button" class="trail-btn-remove-ep">✕</button></div>
        <input type="text" name="ep_nom" value="" placeholder="Nom de l'épreuve">
        <div class="two-col">
          <div><label>Distance</label><input type="text" name="ep_distance" value="" placeholder="42 km"></div>
          <div><label>Dénivelé</label><input type="text" name="ep_denivele" value="" placeholder="+1200 m"></div>
          <div><label>Heure départ</label><input type="text" name="ep_depart" value="" placeholder="19h30"></div>
        </div>
        <label>Description</label><textarea name="ep_description" rows="2"></textarea>
        <label>Lien inscription</label><input type="url" name="ep_inscription" value="" placeholder="https://...">
        <label>Photo</label>
        <div class="media-field" data-field="ep_image"><button type="button" class="button pick-media">Choisir une image</button><input type="hidden" name="ep_image" value=""></div>
      </div>`);
      $list.find('.pick-media').off('click').on('click', function() { /* re-bind */ $list.find('.pick-media').last().click(); });
      bindEvents();
    });

    // Supprimer épreuve/partenaire/resultat/album
    $list.find('.trail-btn-remove-ep, .trail-btn-remove-p, .trail-btn-remove-r, .trail-btn-remove-a, .trail-btn-remove-photo').off('click').on('click', function() {
      $(this).closest('.trail-epreuve, .trail-partenaire, .trail-resultat, .trail-album, .galerie-photo').remove();
    });

    // Ajouter partenaire
    $list.find('.trail-add-partenaire').off('click').on('click', function() {
      $(this).prev('.trail-partenaires-list').append(`<div class="trail-partenaire">
        <input type="text" name="p_nom" value="" placeholder="Nom du partenaire">
        <input type="url"  name="p_url" value="" placeholder="Site web">
        <div class="media-field" data-field="p_logo"><button type="button" class="button pick-media">Logo</button><input type="hidden" name="p_logo" value=""></div>
        <button type="button" class="trail-btn-remove-p">✕</button>
      </div>`);
      bindEvents();
    });

    // Ajouter résultat
    $list.find('.trail-add-resultat').off('click').on('click', function() {
      $(this).prev('.trail-resultats-list').append(`<div class="trail-resultat">
        <input type="text" name="r_annee" value="" placeholder="2025" style="width:80px">
        <input type="url"  name="r_lien"  value="" placeholder="URL des résultats" style="flex:1">
        <button type="button" class="trail-btn-remove-r">✕</button>
      </div>`);
      bindEvents();
    });

    // Ajouter album
    $list.find('.trail-add-album').off('click').on('click', function() {
      $(this).prev('.trail-albums-list').append(`<div class="trail-album">
        <input type="text" name="a_annee" value="" placeholder="2025" style="width:80px">
        <input type="url"  name="a_lien"  value="" placeholder="Lien album" style="flex:1">
        <div class="media-field" data-field="a_image"><button type="button" class="button pick-media">Image</button><input type="hidden" name="a_image" value=""></div>
        <button type="button" class="trail-btn-remove-a">✕</button>
      </div>`);
      bindEvents();
    });

    // Ajouter photo galerie
    $list.find('.trail-add-photo').off('click').on('click', function() {
      var $list2 = $(this).closest('.trail-section').find('.galerie-photos-list');
      var frame = wp.media({ title: 'Ajouter des photos', button: { text: 'Ajouter' }, multiple: true, library: { type: 'image' } });
      frame.on('select', function() {
        frame.state().get('selection').each(function(att) {
          var a = att.toJSON();
          $list2.append(`<div class="galerie-photo"><img src="${a.url}" style="height:60px;object-fit:cover;border-radius:4px"><input type="hidden" name="photo_img" value="${a.id}"><input type="text" name="photo_legende" value="" placeholder="Légende"><button type="button" class="trail-btn-remove-photo">✕</button></div>`);
        });
        bindEvents();
      });
      frame.open();
    });

    // Auto-serialize on change
    $list.find('input, textarea, select').off('change input').on('change input', function() { serialize(); });
  }

  /* ── Ajout de section ────────────────────────────────────────────────── */
  $('#trail-add-btn').on('click', function() {
    var type = $('#trail-section-type').val();
    if (!type) { alert('Choisissez un type de section'); return; }
    var s = { type: type };
    sections.push(s);
    $list.append($(templates[type](s)));
    bindEvents();
    serialize();
    $('html, body').animate({ scrollTop: $list.find('.trail-section').last().offset().top - 100 }, 400);
    $('#trail-section-type').val('');
  });

  /* ── Drag & drop pour réordonner ────────────────────────────────────── */
  $list.sortable({ handle: '.trail-drag-handle', update: function() { serialize(); } });

  /* ── Serialize avant soumission ─────────────────────────────────────── */
  $('form#post').on('submit', function() { serialize(); });

  /* ── Init ────────────────────────────────────────────────────────────── */
  render();
  serialize();
});
