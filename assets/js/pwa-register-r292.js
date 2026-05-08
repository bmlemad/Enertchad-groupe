/* ============================================================
 R292 · PWA registration · install prompt · update detection
 Wave R292 · 2026-05-05 · DG mandate PWA
 ============================================================ */

(function(){
 'use strict';

 if (!('serviceWorker' in navigator)) return;

 // Wait for load to not block initial render
 window.addEventListener('load', function(){
  // Check kill-switch flag (R85 legacy compat)
  if (sessionStorage.getItem('enr_sw_killed_r85')){
   // Re-register the new SW after legacy kill
   sessionStorage.removeItem('enr_sw_killed_r85');
  }

  navigator.serviceWorker.register('/assets/js/sw-r292.js?v=r292', { scope: '/' })
   .then(function(reg){
    // Update detection
    reg.addEventListener('updatefound', function(){
     var newWorker = reg.installing;
     newWorker.addEventListener('statechange', function(){
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller){
       // New version available · show toast (optional)
       console.info('[EnerTchad PWA] Nouvelle version disponible. Reload pour activer.');
      }
     });
    });
   })
   .catch(function(err){
    console.warn('[EnerTchad PWA] SW registration failed:', err);
   });
 });

 // PWA install prompt (deferred event)
 var deferredPrompt = null;
 window.addEventListener('beforeinstallprompt', function(e){
  e.preventDefault();
  deferredPrompt = e;
  // Could show custom install button here · placeholder for future UX
 });

 window.addEventListener('appinstalled', function(){
  console.info('[EnerTchad PWA] App installée avec succès');
  deferredPrompt = null;
 });
})();
