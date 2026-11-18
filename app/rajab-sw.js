// إشعارات صفحة رجب التجريبية بس
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{
  let d={};try{d=e.data.json();}catch(_){d={title:'برنامج عبادة 🌙',body:e.data?e.data.text():''};}
  e.waitUntil(self.registration.showNotification(d.title||'برنامج عبادة 🌙',{body:d.body||'',icon:'icon.png',badge:'icon.png',dir:'rtl',lang:'ar',data:{url:d.url||'rajab-demo.html'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=new URL(e.notification.data&&e.notification.data.url||'rajab-demo.html',self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if(c.url.includes('rajab-demo')&&'focus' in c)return c.focus();}return self.clients.openWindow(url);}));
});
