// V2.5 Decision Engine Demo shell.
// Serves the existing app HTML and injects the focused demo bootstrap on the main route.
module.exports=async function handler(req,res){
  try{
    const proto=(req.headers['x-forwarded-proto']||'https').split(',')[0].trim();
    const host=req.headers.host;
    if(!host)throw new Error('Missing request host');
    const response=await fetch(`${proto}://${host}/index.html`,{headers:{'user-agent':'Vacation-Planner-Demo-Shell/1.0'}});
    if(!response.ok)throw new Error(`Unable to load app shell (${response.status})`);
    let html=await response.text();
    const bootstrap='<script src="/decision-demo-loader.js?v=2.5.0"></script>';
    if(!html.includes('decision-demo-loader.js'))html=html.replace('</body>',`${bootstrap}\n</body>`);
    html=html.replace('DECISION BETA · V2.4','DECISION DEMO · V2.5');
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','no-store, max-age=0');
    res.status(200).send(html);
  }catch(error){
    console.error('V2.5 demo shell error',error);
    res.status(500).send('Vacation Planner demo is temporarily unavailable.');
  }
};
