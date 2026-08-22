/* =========================================================
   HUOKAING THARA SYSTEM - GOOGLE TRANSLATE INTEGRATION
========================================================= */

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,km,zh-CN,th,ja,ko,es,fr', // km = Khmer, en = English, etc.
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

// Dynamically load the official Google Translate script asynchronously
(function() {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(script);
})();
