/* ============================================================
 R284 · Theme toggle · light/dark/auto
 Wave R284 · 2026-05-05 · DG mandate modernization
 Persists choice in localStorage · respects prefers-color-scheme
 ============================================================ */

(function(){
 'use strict';

 var STORAGE_KEY = 'enertchad_theme';
 var html = document.documentElement;

 // 1. Apply stored preference (or auto)
 function applyTheme(theme){
  if (theme === 'light' || theme === 'dark'){
   html.setAttribute('data-theme', theme);
  } else {
   html.removeAttribute('data-theme'); // auto via prefers-color-scheme
  }
 }

 // 2. Get current effective theme (resolved)
 function currentTheme(){
  var stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
 }

 // 3. Init on load — restore preference
 var stored = localStorage.getItem(STORAGE_KEY);
 if (stored){ applyTheme(stored); }

 // 4. Build toggle button if not present
 function buildToggle(){
  if (document.querySelector('.theme-toggle')) return;
  var btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'Basculer entre thème clair et sombre');
  btn.setAttribute('type', 'button');
  btn.setAttribute('data-mode', currentTheme());

  btn.addEventListener('click', function(){
   var next = currentTheme() === 'dark' ? 'light' : 'dark';
   applyTheme(next);
   localStorage.setItem(STORAGE_KEY, next);
   btn.setAttribute('data-mode', next);

   // Dispatch event for other JS modules to react
   window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  });

  document.body.appendChild(btn);
 }

 if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', buildToggle);
 } else {
  buildToggle();
 }

 // 5. Listen to system preference changes (when no manual override)
 if (window.matchMedia){
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e){
   if (!localStorage.getItem(STORAGE_KEY)){
    var btn = document.querySelector('.theme-toggle');
    if (btn) btn.setAttribute('data-mode', e.matches ? 'dark' : 'light');
   }
  });
 }
})();
