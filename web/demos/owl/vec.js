define(function() {
 var vec = {};

 vec.dp = function(u,v) { return(u[0] * v[0] + u[1] * v[1] + u[2] * v[2]); };

 vec.nm = function(u)   { return(Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2])); };

 vec.dd = function(u,v) { return(vec.nm([u[0] - v[0], u[1] - v[1], u[2] - v[2]])); };

 vec.xp = function(u,v) {
  return([u[1] * v[2] - u[2] * v[1],
	  u[2] * v[0] - u[0] * v[2],
	  u[0] * v[1] - u[1] * v[0]]);
 };

 vec.smul = function(t,u) { return [t * u[0], t * u[1], t * u[2]]; };

 vec.mmul = function(M,u) {
  return ([M[0][0] * u[0] + M[0][1] * u[1] + M[0][2] * u[2],
	   M[1][0] * u[0] + M[1][1] * u[1] + M[1][2] * u[2],
	   M[2][0] * u[0] + M[2][1] * u[1] + M[2][2] * u[2]]);
 };

 vec.hat  = function(u) {
  var r = vec.nm(u);
  return [u[0] / r, u[1] / r, u[2] / r];
 };

 vec.add = function() {
  var u,i,a;
  u = [0,0,0];
  for (i = 0; i < arguments.length; i++) {
   a = arguments[i];
   u = [u[0] + a[0], u[1] + a[1], u[2] + a[2]];
  }
  return u;
 };

 vec.sub = function(u,v) {
  return [u[0] - v[0], u[1] - v[1], u[2] - v[2]];
 };

 vec.orient_face = function(ii,v) {
  var i,j,u0,u1,u2,vv;

  u0 = [0,0,0];

  for (ix = 0; ix < ii.length; ix++) {
   u0 = this.add(u0, v[ii[ix]]);
  }

  u0 = this.hat(u0);
  u1 = v[ii[0]];
  u1 = this.add(u1, this.smul(- this.dp(u0,u1), u0));
  u1 = this.hat(u1);
  u2 = vec.xp(u0,u1);
  vv = ii.map(i => [Math.atan2(this.dp(v[i],u2),this.dp(v[i],u1)),i]);
  vv.sort((x,y) => (x[0] - y[0]));
  vv = vv.map(x => x[1]);
  return vv;
 };

 return vec;
});
