(function(w, d) {
    if(!w.AdverturManager) {
        w.AdverturManager = {
            banners: [],
            maxCountTime: 120,
            countTime: 0,
            hidden: '',
            visibilityChange: '',

            init: function(w, d) {
                this.window = w;
                this.document = d;

                try {
                    if (typeof this.document.hidden !== "undefined") {
                        this.hidden = "hidden";
                        this.visibilityChange = "visibilitychange";
                    } else if (typeof this.document.msHidden !== "undefined") {
                        this.hidden = "msHidden";
                        this.visibilityChange = "msvisibilitychange";
                    } else if (typeof this.document.webkitHidden !== "undefined") {
                        this.hidden = "webkitHidden";
                        this.visibilityChange = "webkitvisibilitychange";
                    }
                    if (typeof this.document.addEventListener !== "undefined") {
                        this.document.addEventListener(
                            this.visibilityChange,
                            function() {
                                try {
                                    var aManager = window.AdverturManager || top.window.AdverturManager;
                                    if(aManager) {
                                        // aManager.handleVisibilityChange();
                                    }
                                }catch(err){}
                            },
                            false);
                    }
                } catch (err){}

                this.renderBanners();
            },

            renderBanners: function() {
                if (this.window['advertur_sections'] && this.window['advertur_sections'].length) {
                    for (var index in w['advertur_sections']) {
                        if (this.window['advertur_sections'].hasOwnProperty(index) && !this.window['advertur_sections'][index].rendered) {
                            var el = this.window['advertur_sections'][index];
                            this.window['advertur_sections'][index].rendered = true;

                            this.renderBanner(el.section_id, el.place, el.width, el.height, el.h, el.s, el.r);
                        }
                    }
                }
                if(++this.window.AdverturManager.countTime < this.window.AdverturManager.maxCountTime) {
                    setTimeout(function() {
                        try {
                            top.window.AdverturManager.renderBanners();
                        }catch(err){}
                    }, 1000);
                }
            },

            renderBanner: function(section_id, place, width, height, h, s, r) {
                var div = this.document.getElementById(place);

                if (div && !this.document.getElementById('advertur_section_' + place + '_iframe')) {
                    div.width = width;
                    div.height = height;

                    var publicId = "";
                    try {
                        publicId = this.document.doctype.publicId;
                    } catch (err) {
                        publicId = '';
                    }

                    var documentMode = false;
                    try {
                        documentMode = !(this.document.documentMode > 9);
                    } catch (err) {
                        documentMode = false;
                    }

                    if( (AdverturManager.msieversion() && ((/XHTML/.test(publicId)) || documentMode )) || AdverturManager._getCookie('advertur_hide_' + section_id)) {
                        div.parentElement.removeChild(div);
                    } else {
                        var secondDiv =  this.document.createElement("div");
                        secondDiv.id = 'advertur_at_' + section_id;

                        var iframe = this.document.createElement("iframe");
                        iframe.id = 'advertur_section_' + place + '_iframe';
                        iframe.style.border = '0px solid black';
                        iframe.style.margin = '0';
                        iframe.style.padding = '0';
                        iframe.frameborder = 0;

                        iframe.scrolling = 'no';
                        iframe.width = width;
                        iframe.height = height;
                        secondDiv.appendChild(iframe);
                        div.appendChild(secondDiv);

                        var docIf = iframe.contentWindow || iframe.contentDocument;
                        if (docIf.document) {
                            docIf = docIf.document;
                        }
                        var url = '//ddnk.advertur.ru/v1/code.js?id=' + section_id + '&async=1';
                        if(h) {
                            url += '&h=' + h;
                        } else if(s) {
                            url += '&s=' + s;
                        } else if(r) {
                            url += '&r=' + r;
                        }
                        iframe.src = "javascript:void((function(){var script = document.createElement('script');" +
                            'script.innerHTML = "(function() {document.open();document.domain=\'' + this.document.domain + '\';document.close();})();";' +
                            'document.write(script.outerHTML);})())';

                        docIf.write('<head></head>');
                        docIf.write('<body style="margin:0px;padding:0px;">');
                        docIf.write('<scr' + 'ipt src="' + url + '" ></scr' + 'ipt>');
                        docIf.write('<script type="text/javascript">document.close();</script>');
                        docIf.write('</body>');
                    }
                }
            },

            showSlideBannersPlace: function(section_id, position, s, h) {
                position = position || 0;
                s = s || false;
                h = h || 9;

                try {
                    this.renderSlideBanner(section_id, position);
                    this.reloadBannerPlace(section_id, s, h);
                } catch (err){ console.log(err) }
            },

            renderSlideBanner: function(section_id, position) {
                var el = this.getBannerElementBySectionId(section_id);
                if(el) {
                    var closeButtonId = 'advertur_section_' + el.place + '_closeButton';
                    var div = this.document.getElementById(el.place);

                    if (div && !this.document.getElementById(closeButtonId)) {
                        var closeButton = this.document.createElement("div");
                        closeButton.id = closeButtonId;
                        closeButton.innerHTML = '<a href="#" style="text-decoration: none;z-index: 2147483647;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACtUlEQVR42pWWz2oaURTGM+qMWmptwdRKmzSIYDYuzENYXTftWkQkGPEvqYLR3KHpA+hKH0Pt3wepoZsuukrVQoJLCfZ8wQPjZIarAx/K9Zzv5z3nzpnZ2eJyknykR5sE74cPFZYsdpeUIOVJbZJY6Xy1lkCMtbkc4iMdky7cbrdIJpOi1WqJfr8P3X9PJBICvyEGsYri8MFwU8g+6czr9d6bzWYzsVwuLYXfms2mQCxydhTl9SaQV6RmNBoVV1dXbCYVYpGDXAId2EG4RGeRSERMJhMkbyXkIBceKJ0d5K3H41nbwXw+/ygzN8YgFx7okRVkFw2s1WrGen+Kx+PjarU6sDK/u7sTuVzuG5Xp983NzSWvwwNeiqI8X0EcDHmjaZqYTqdrRsVicRiLxX6Vy+WBGZDNZr+Hw+E/JycnX82HAV7UmyQARkgex9Ti3wI0YhCvZTIZBnyx2mUqldLJ89QIcZLajUZD2JWFd1QqlYYSAOL1er0OyMXjJ09VhvhIotvtIsgWBEAwGJwEAoF/+XzeFgB1Oh1AdJdL9W8FSafTPwAIhUJ/qXRDrJkBNhCntFwMQIloB58BQOkYZAYYy+XzP9MYwo2XAnidQejVYrHQzRBuPACQ8Qg/mFMMKBQKDIAYNFiBRkYA3fk6DU4dR5ghazcjBiKb4AbDjUaAkV2TK5XK4Ojo6Oft7e0lQ8gDuxBOp/rCDMF1LBkrlk02AsbjsU4TGZD3DCC5pANSBmFdX1/rlAvAB1XT/AwwQ3DtmUa9FMA7oBwAzh0OxwED7CDUL+UlfVTxIGq32w8Og6nJ6AGXqEaAPRMAUi1fAPA8MD9+Aez1ejoEY1rDKYK5IL1DiawAthAWxvXqZeGU1CbpK7VIBRxTPkUMkEJgbCcMO4wJVdV8PF1hLAFsB2FjK4BNmVjaf5I6+NSKts2YAAAAAElFTkSuQmCC" style="width: 25px !important;height: 25px !important;margin: 0px !important;padding: 0px !important;"></a>';
                        this.document.getElementsByTagName('body')[0].appendChild(closeButton);
                        closeButton.style.position = 'fixed';
                        closeButton.style.border = '0px solid black';
                        closeButton.style.margin = '0px';
                        closeButton.style.padding = '0px';
                        closeButton.style.bottom = el.height + 'px';
                        closeButton.style.zIndex = '2147483647';
                        closeButton.style.display = 'none';
                        closeButton.onclick = function(){
                            try {
                                top.AdverturManager._setCookie('advertur_hide_' + section_id, 1, {patch:'/', expires: 60*60});
                                top.AdverturManager.removeBannersPlace(section_id);
                            }catch(err){}
                            return false;
                        };

                        div.style.position = 'fixed';
                        div.style.width = el.width + 'px';
                        div.style.height = el.height + 'px';
                        div.style.margin = '0px';
                        div.style.padding = '1px';
                        div.style.border = '0px solid #000000';
                        div.style.zIndex = '2147483647';
                        div.style.bottom = '0px';
                        div.style['background-color'] = '#FFF';
                        div.style.display = 'block';

                        var clientSize = this._getClientSize();

                        if (clientSize.width <= parseInt(el.width)+50 || clientSize.height <= parseInt(el.height)+50) {
                            if ( clientSize.width <= parseInt(el.width)+50 ) {
                                div.style.left = '0px';
                                closeButton.style.left = parseInt(clientSize.width - 25) + 'px';
                            } else {
                                div.style.left = parseInt(clientSize.width/2 - el.width/2 ) + 'px';
                                closeButton.style.left = parseInt(clientSize.width / 2 + el.width/2) + 'px';
                            }

                            if ( clientSize.height <= parseInt(el.height)+50 ) {
                                div.style.top = '25px';
                                closeButton.style.top = '0px';
                            } else {
                                div.style.top = parseInt(clientSize.height/2 - el.height/2) + 'px';
                                closeButton.style.top = parseInt(clientSize.height/2 - el.height/2 - 25) + 'px';
                            }
                        } else {
                            switch (parseInt(position)) {
                                case 1:
                                    closeButton.style.left = parseInt(clientSize.width / 2 + el.width / 2) + 'px';
                                    div.style.left = parseInt(clientSize.width / 2 - el.width / 2) + 'px';
                                break;
                                case 2:
                                    closeButton.style.right = el.width + 'px';
                                    div.style.right = '0px';
                                break;
                                default:
                                    closeButton.style.left = el.width + 'px';
                                    div.style.left = '0px';
                                break;
                            }
                        }

                        setTimeout(function(){
                            try {
                                var closeButtonId = 'advertur_section_' + el.place + '_closeButton';
                                var div = top.AdverturManager.document.getElementById(el.place);
                                if(div) {
                                    div.style.border = '1px solid #000000';
                                    div.style.padding = '0px';
                                }
                                var closeButton = top.AdverturManager.document.getElementById(closeButtonId);
                                if(closeButton) {
                                    closeButton.style.display = 'block';
                                }
                            }catch(err){}
                        }, 4000);
                    }
                }
            },

            renderMobile: function (section_id) {
                var el = this.getBannerElementBySectionId(section_id),
                    htmlElement = this.document.getElementsByTagName("html")[0];
                if(el) {
                    var closeButtonId = 'advertur_section_' + el.place + '_closeButton';
                    var div = this.document.getElementById(el.place);
                    if (div && !this.document.getElementById(closeButtonId)) {
                        div.style.border = '0px solid black';
                        div.style.margin = '0';
                        div.style.padding = '0';
                        div.style.position = 'absolute';
                        div.style.background = 'rgba(0, 0, 0, 0.701961)';
                        div.style.transform = 'translateZ(0px)';
                        div.style.overflow = 'hidden';
                        div.style.direction = 'ltr';
                        div.style.opacity = '1';
                        div.style.top = '0';
                        div.style.left = '0';
                        div.style.width = '100%';
                        div.style.height = '100%';
                        htmlElement.style.overflow = 'hidden';

                        var closeButton = this.document.createElement("div");

                        closeButton.id = closeButtonId;
                        closeButton.innerHTML = '<a href="#" style="text-decoration: none;z-index: 2147483647;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACtUlEQVR42pWWz2oaURTGM+qMWmptwdRKmzSIYDYuzENYXTftWkQkGPEvqYLR3KHpA+hKH0Pt3wepoZsuukrVQoJLCfZ8wQPjZIarAx/K9Zzv5z3nzpnZ2eJyknykR5sE74cPFZYsdpeUIOVJbZJY6Xy1lkCMtbkc4iMdky7cbrdIJpOi1WqJfr8P3X9PJBICvyEGsYri8MFwU8g+6czr9d6bzWYzsVwuLYXfms2mQCxydhTl9SaQV6RmNBoVV1dXbCYVYpGDXAId2EG4RGeRSERMJhMkbyXkIBceKJ0d5K3H41nbwXw+/ygzN8YgFx7okRVkFw2s1WrGen+Kx+PjarU6sDK/u7sTuVzuG5Xp983NzSWvwwNeiqI8X0EcDHmjaZqYTqdrRsVicRiLxX6Vy+WBGZDNZr+Hw+E/JycnX82HAV7UmyQARkgex9Ti3wI0YhCvZTIZBnyx2mUqldLJ89QIcZLajUZD2JWFd1QqlYYSAOL1er0OyMXjJ09VhvhIotvtIsgWBEAwGJwEAoF/+XzeFgB1Oh1AdJdL9W8FSafTPwAIhUJ/qXRDrJkBNhCntFwMQIloB58BQOkYZAYYy+XzP9MYwo2XAnidQejVYrHQzRBuPACQ8Qg/mFMMKBQKDIAYNFiBRkYA3fk6DU4dR5ghazcjBiKb4AbDjUaAkV2TK5XK4Ojo6Oft7e0lQ8gDuxBOp/rCDMF1LBkrlk02AsbjsU4TGZD3DCC5pANSBmFdX1/rlAvAB1XT/AwwQ3DtmUa9FMA7oBwAzh0OxwED7CDUL+UlfVTxIGq32w8Og6nJ6AGXqEaAPRMAUi1fAPA8MD9+Aez1ejoEY1rDKYK5IL1DiawAthAWxvXqZeGU1CbpK7VIBRxTPkUMkEJgbCcMO4wJVdV8PF1hLAFsB2FjK4BNmVjaf5I6+NSKts2YAAAAAElFTkSuQmCC" style="width: 25px !important;height: 25px !important;margin: 0px !important;padding: 0px !important;"></a>';
                        this.document.getElementsByTagName('body')[0].appendChild(closeButton);
                        closeButton.style.position = 'absolute';
                        closeButton.style.border = '0px solid black';
                        closeButton.style.margin = '0px';
                        closeButton.style.padding = '0px';
                        closeButton.style.top = '0';
                        closeButton.style.right = '0';
                        closeButton.style.zIndex = '2147483647';
                        closeButton.onclick = function () {
                            try {
                                top.AdverturManager._setCookie('advertur_hide_' + section_id, 1, {
                                    patch: '/',
                                    expires: 60 * 60
                                });
                                top.AdverturManager.removeBannersPlace(section_id);
                                htmlElement.style.overflow = '';
                                closeButton.style.display = 'none';
                            } catch (err) {
                            }
                            return false;
                        };
                        this.renderBanner(section_id, el.place, '100%', '100%');
                    }
                }
            },

            renderMobileSection: function(section_id, p, w, h, t) {
                var el = this.getBannerElementBySectionId(section_id),
                    place = p || ('advertur_' + section_id),
                    width = w || 0,
                    height = h || 0
                ;

                if( !el && !this.document.getElementById(place) ) {
                    var div = this.document.createElement("div");
                    div.id = place;
                    div.style.border = '0px solid black';
                    div.style.margin = '0';
                    div.style.padding = '0';
                    div.width = width;
                    div.height = height;

                    this.document.getElementsByTagName('body')[0].appendChild(div);

                    this.renderBanner(section_id, place, width, height);
                }
            },

            reloadBannerPlace: function(section_id, s, h, r) {
                try {
                    if (this.window['advertur_sections'] && this.window['advertur_sections'].length) {
                        for (var index in this.window['advertur_sections']) {
                            if (this.window['advertur_sections'].hasOwnProperty(index)) {
                                if (this.window['advertur_sections'][index].section_id == section_id) {
                                    var div = this.document.getElementById(this.window['advertur_sections'][index].place),
                                        strict = this.window['advertur_sections'][index].strict || false;
                                    if(div && !strict) {
                                        div.innerHTML = '';

                                        this.window['advertur_sections'][index].rendered = false;
                                        this.window['advertur_sections'][index].s = (s || false);
                                        this.window['advertur_sections'][index].h = (h || false);
                                        this.window['advertur_sections'][index].r = (r || false);

                                        this.renderBanners();
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }catch(err){ console.log(err); }
            },

            rotationBannerPlace: function(section_id, s, h, r) {
                try {
                    if (this.window['advertur_sections'] && this.window['advertur_sections'].length) {
                        for (var index in this.window['advertur_sections']) {
                            if (this.window['advertur_sections'].hasOwnProperty(index)) {
                                if (this.window['advertur_sections'][index].section_id == section_id) {
                                    var
                                        el = this.window['advertur_sections'][index],
                                        div = this.document.getElementById(el.place),
                                        strict = el.strict || false
                                    ;
                                    if(div && !strict && el.at_code) {
                                        try{
                                            var wrapper = this.document.createElement('div');
                                            wrapper.innerHTML = decodeURIComponent(el.at_code.replace(/\+/g, ' '));
                                            var
                                                all = wrapper.querySelectorAll('*')
                                            ;
                                            for(var i=0; i<all.length; i++) {
                                                if(all[i].nodeName == 'SCRIPT') {
                                                    if(all[i].src != '') {
                                                        var script = this.document.createElement('script');
                                                        for(k in all[i].attributes) {
                                                            if(all[i].attributes.hasOwnProperty(k)) {
                                                                var name_prop = all[i].attributes[k].name;
                                                                script[name_prop] = all[i][name_prop];
                                                            }
                                                        }
                                                        script.setAttribute('type', 'text/javascript');
                                                        div.appendChild(script);
                                                    } else {
                                                        div.appendChild(all[i]);
                                                        var last_child = div.childNodes[div.childNodes.length-1];
                                                        try {
                                                            eval.call(this.window, last_child.innerHTML);
                                                        } catch (e) {
                                                            console.log('http://ddnk.advertur.ru/v1/s/eval.call', e);
                                                        }
                                                    }
                                                } else {
                                                    div.appendChild(all[i]);
                                                }
                                            }
                                        } catch(e) {
                                            console.log(e, this);
                                        }
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }catch(err){ console.log(err); }
            },

            removeBannersPlace: function(section_id) {
                try {
                    var
                        place = 'advertur_' + section_id,
                        el = this.getBannerElementBySectionId(section_id),
                        div
                    ;

                    if (el && el.rendered) {
                        place = el.place;
                    }

                    div = this.document.getElementById(place);
                    if(div) {
                        div.parentNode.removeChild(div);
                    }

                    div = this.document.getElementById('advertur_section_' + place + '_closeButton');
                    if(div) {
                        div.parentNode.removeChild(div);
                    }
                }catch(err){console.log(err);}
            },

            getBannerElementBySectionId: function(section_id) {
                var result = false;
                try {
                    if (this.window['advertur_sections'] && this.window['advertur_sections'].length) {
                        for (var index in this.window['advertur_sections']) {
                            if (this.window['advertur_sections'].hasOwnProperty(index)) {
                                if (this.window['advertur_sections'][index].section_id == section_id) {
                                    return this.window['advertur_sections'][index];
                                }
                            }
                        }
                    }
                }catch(err){
                    result = false;
                }
                return result;
            },

            msieversion: function() {
                try {
                    var ua = this.window.navigator.userAgent;
                    var msie = ua.indexOf('MSIE ');
                    if (msie > 0) {
                        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                    }
                    var trident = ua.indexOf('Trident/');
                    if (trident > 0) {
                        var rv = ua.indexOf('rv:');
                        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                    }

                    var edge = ua.indexOf('Edge/');
                    if (edge > 0) {
                        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                    }
                }catch(err) {
                    return false;
                }
                return false;
            },

            _getCookie: function(name) {
                var matches = this.document.cookie.match(new RegExp(
                    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
                ));
                return matches ? decodeURIComponent(matches[1]) : undefined;
            },

            _setCookie: function(name, value, options) {
                options = options || {};

                var expires = options.expires;

                if (typeof expires == "number" && expires) {
                    var d = new Date();
                    d.setTime(d.getTime() + expires * 1000);
                    expires = options.expires = d;
                }
                if (expires && expires.toUTCString) {
                    options.expires = expires.toUTCString();
                }

                value = encodeURIComponent(value);

                var updatedCookie = name + "=" + value;

                for (var propName in options) {
                    updatedCookie += "; " + propName;
                    var propValue = options[propName];
                    if (propValue !== true) {
                        updatedCookie += "=" + propValue;
                    }
                }

                this.document.cookie = updatedCookie;
            },

            _getClientSize: function() {
                var K = this.document.createElement("div");
                K.setAttribute("style", "position:absolute;width:100%;height:100%;z-index:-9999;");
                this.document.body.appendChild(K);
                var J = {
                    width: K.clientWidth,
                    height: K.clientHeight
                };
                K.remove();
                return J;
            },

            handleVisibilityChange: function () {
                try {
                    var self = this.window.AdverturManager || top.window.AdverturManager;
                    if(self) {
                        if (self.document[self.hidden]) {
                            //
                        } else {
                            //reload
                            if (self.window['advertur_sections'] && self.window['advertur_sections'].length) {
                                for (var index in self.window['advertur_sections']) {
                                    if (self.window['advertur_sections'][index].rendered ) {
                                        var el = self.window['advertur_sections'][index];
                                        self.rotationBannerPlace(el.section_id, el.h, el.s, 13);
                                    }
                                }
                            }
                        }
                    }
                }catch(err){ }
            },

            setElementSettings: function(section_id, name, value) {
                try {
                    if (this.window['advertur_sections'] && this.window['advertur_sections'].length) {
                        for (var index in this.window['advertur_sections']) {
                            if (this.window['advertur_sections'].hasOwnProperty(index)) {
                                if (this.window['advertur_sections'][index].section_id == section_id) {
                                    this.window['advertur_sections'][index][name] = value;
                                }
                            }
                        }
                    }
                }catch(err){ }
            }
        };

        w.AdverturManager.init(w, d);
    }
})(window, document);