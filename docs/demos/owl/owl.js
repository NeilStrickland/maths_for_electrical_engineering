define(['babylonjs','vec'],function(BABYLON,vec) {
 var owl = {};
 var owl2 = {};
 var owl3 = {};
 owl.two_d = owl2;
 owl.three_d = owl3;
 
 // Miscellaneous functions

 owl.load_css = function(url) {
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.getElementsByTagName("head")[0].appendChild(link);
 }
 
 owl.flat = function(a) {
  var b = [];
  for (i = 0; i < a.length; i++) {
   b = b.concat(a[i]);
  }

  return b;
 };

 owl.standard_colour = function(i) {
  var C = [
   [255,  0,  0], [229,122,  0], [ 76,115,  0], [ 64,255, 89],
   [ 38,145,153], [  0, 41,153], [213,128,255], [230,115,161],
   [ 89,  0,  0], [ 89, 58, 22], [204,197,102], [ 51,102, 58],
   [  0,204,255], [115,130,230], [ 96, 57,115], [242,  0, 65],
   [191, 67, 48], [178,137, 89], [255,238,  0], [ 45,179, 98],
   [  0, 68,128], [ 36,  0, 89], [204,  0,163], [127, 64, 72],
   [255,162,128], [102, 82,  0], [195,255,128], [128,255,246],
   [ 77,117,153], [136,  0,204], [102,  0, 54]
  ];

  var n = C.length;
  var c = C[(i + n - 1) % n];
  c = [c[0] / 255., c[1] / 255., c[2] / 255.];
  return c;
 };

 owl.math_font = 'MathJax_Math-italic';

 //////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////
 // Three dimensions

 owl3.scene = null;

 // transform can be set to an affine self-map of R3
 owl3.transform = function(x) {
  return x;
 };

 owl3.transform0 = function(x) {
  return vec.sub(this.transform(x),this.transform([0,0,0]));
 };

 owl3.basic_scene = function(engine,canvas) {
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.White();

  var light = new BABYLON.HemisphericLight("light0", new BABYLON.Vector3(-1, 1, 0), scene);
  light.diffuse     = new BABYLON.Color3(0.6, 0.4, 0.4);
  light.specular    = new BABYLON.Color3(0.2, 0.5, 0.4);
  light.groundColor = new BABYLON.Color3(0.6, 0.7, 0.8);

  var camera = new BABYLON.ArcRotateCamera("camera1",  0, 1.2, 10, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.wheelPrecision = 50;

  scene.camera = camera;

  this.scene = scene;

  return scene;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.white_scene = function(engine,canvas) {
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.White();

  var light = new BABYLON.HemisphericLight("light0", new BABYLON.Vector3(-1, 1, 0), scene);
  light.diffuse     = new BABYLON.Color3(1.0, 1.0, 1.0);
  light.specular    = new BABYLON.Color3(1.0, 1.0, 1.0);
  light.groundColor = new BABYLON.Color3(1.0, 1.0, 1.0);

  var camera = new BABYLON.ArcRotateCamera("camera1",  0, 1.2, 10, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.wheelPrecision = 50;

  scene.camera = camera;

  this.scene = scene;

  return scene;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.set_colour = function(mesh,c) {
  var mat = new BABYLON.StandardMaterial("mat", mesh.getScene());
  mat.backFaceCulling = false;
  mat.diffuseColor  = new this.col3(c);
  mesh.material = mat;
  mesh.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.make_grid_with_normal = function(n,m,f,g,h) {
  var i,j,t,u,x,xx,v,vv,uv,positions,indices,normals,grid;

  positions = [];
  indices = [];
  normals = [];
  uvs = [];

  for (i = 0; i <= n; i++) {
   for (j = 0; j <= m; j++) {
    t = (i * 1.)/n;
    u = (j * 1.)/m;
    x = f(t,u);
    xx = this.transform(x);
    positions.push(xx[0],xx[1],xx[2]);
    if (g) {
     v = g(t,u);
     vv = this.transform0(v);
     normals.push(vv[0],vv[1],vv[2]);
    }
    if (h) {
     uv = h(t,u);
     uvs.push(uv[0],uv[1]);
    }
    if (i < n && j < m) {
     i1 = (i + 1);
     j1 = (j + 1);
     k0 = (m + 1) * i  + j;
     k1 = (m + 1) * i1 + j;
     k2 = (m + 1) * i  + j1;
     k3 = (m + 1) * i1 + j1;
     indices.push(k0,k1,k3,k0,k3,k2);
    }
   }
  }

  if (!g) {
   BABYLON.VertexData.ComputeNormals(positions, indices, normals);
  }

  var grid = new BABYLON.VertexData();
  grid.positions = positions;
  grid.normals   = normals;
  grid.indices   = indices;

  if (h) {
   grid.uvs = uvs;
  }

  return grid;
 };

 owl3.make_grid = function(n,m,f) {
  return this.make_grid_with_normal(n,m,f,null);
 };

 //////////////////////////////////////////////////////////////////////

 // Convenience method that converts argument v to an instance of
 // BABYLON.Vector3, where v can be an array of length 3, or an
 // object with members x, y and z, or an object with members
 // 0, 1 and 2.  In particular v can itself be a BABYLON.Vector3.

 owl3.vect = function(v) {
  if (Array.isArray(v)) {
   return new BABYLON.Vector3(v[0],v[1],v[2]);
  }

  if (('x' in v) && ('y' in v) && ('z' in v)) {
   return new BABYLON.Vector3(v.x,v.y,v.z);
  }

  if ((0 in v) && (1 in v) && (2 in v)) {
   return new BABYLON.Vector3(v[0],v[1],v[2]);
  }

  return new BABYLON.Vector3(0,0,0);
 };

 //////////////////////////////////////////////////////////////////////
 // Convenience method that converts argument v to an array of
 // length 3, where v can be an array of length 3, or an
 // object with members x, y and z, or an object with members
 // 0, 1 and 2.  In particular v can be a BABYLON.Vector3.

 owl3.unvect = function(v) {
  if (Array.isArray(v)) {
   return [v[0],v[1],v[2]];
  }

  if (('x' in v) && ('y' in v) && ('z' in v)) {
   return [v.x,v.y,v.z];
  }

  if ((0 in v) && (1 in v) && (2 in v)) {
   return [v[0],v[1],v[2]];
  }

  return [0,0,0];
 };

 //////////////////////////////////////////////////////////////////////
 // Convenience functions to convert different representations
 // of colours.  The col0 function returns a, [r,g,b,alpha] list,
 // the col3 function returns a BABYLON.Color3 (with r,g,b fields)
 // and the col4 function returns a BABYLON.Color4 (which also
 // has an alpha field).  All three functions accept any of these
 // forms as argument.

 owl3.col0 = function(c) {
  if (Array.isArray(c)) { return c; }

  if (('r' in c) && ('g' in c) && ('b' in c)) {
   if ('a' in c) {
    return [c.r,c.g,c.b,c.a];
   } else {
    return [c.r,c.g,c.b,1];
   }
  }

  if ((0 in c) && (1 in c) && (2 in c)) {
   if (3 in c) {
    return [c[0],c[1],c[2],c[3]];
   } else {
    return [c[0],c[1],c[2],1];
   }
  }

  return [0,0,0,0];
 };

 owl3.col3 = function(c) {
  var c0 = owl3.col0(c);
  return new BABYLON.Color3(c0[0],c0[1],c0[2]);
 };

 owl3.col4 = function(c) {
  var c0 = owl3.col0(c);
  return new BABYLON.Color4(c0[0],c0[1],c0[2],c0[3]);
 };

 //////////////////////////////////////////////////////////////////////
 // Return a BABYLON mesh for a sphere, intended for use with small
 // spheres marking points.

 owl3.point = {
  owner : null,
  position : [0,0,0],
  diameter : 0.03,
  colour   : [1,0,0]
 };

 owl3.point.make_mesh = function() {
  var c = this.colour;
  var d = this.diameter;
  var p = this.position;
  var x = this.owner.transform(p);
  this.mesh = BABYLON.MeshBuilder.CreateSphere("point",
   {diameter : d}, this.owner.scene);
  this.owner.set_colour(this.mesh,c);
  this.mesh.position = this.owner.vect(x);
  return this.mesh;
 };

 owl3.point.set_position = function(p) {
  this.position = p;
  var x = this.owner.transform(p);
  this.mesh.position = this.owner.vect(x);
 };

 owl3.make_point = function(u,c,d) {
  var x = Object.create(this.point);
  x.owner = this;
  x.position = u;
  x.colour = this.col4(c);
  x.diameter = d;
  x.make_mesh();
  return x;
 };

 //////////////////////////////////////////////////////////////////////
 // Return a BABYLON mesh for a label.  The label will have text in black on
 // a small white rectangle, which will rotate automatically so that it
 // always faces the camera.

 owl3.label = {
  owner : null,
  position : [0,0,0],
  text : 'label',
  width : 0.2,
  height : 0.2,
  font_size : 200
 };

 owl3.label.make_mesh = function() {
  var u0 = owl3.vect(this.owner.transform(this.position));
  var n = u0.subtract(this.owner.scene.camera.position);
  this.source_plane = new BABYLON.Plane(-n.x,-n.y,-n.z,0);
  this.source_plane.normalize();

  var opts = {
   sourcePlane : this.source_plane,
   updatable : true
  };

  this.label_plane = BABYLON.MeshBuilder.CreatePlane(null,opts,this.owner.scene);
  this.label_plane.position = u0;
  this.label_plane.sourcePlane = this.source_plane;
  this.plane_texture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.label_plane);
  this.button = BABYLON.GUI.Button.CreateSimpleButton(null, this.text);
  this.button.width  = this.width;
  this.button.height = this.height;
  this.button.color  = 'black';
  this.button.background = 'white';
  this.button.fontSize = this.font_size;
  this.plane_texture.addControl(this.button);
 };

 owl3.make_label = function(u,t,opts) {
  var x = Object.create(this.label);
  if (arguments.length > 2) {
   Object.assign(x,opts);
  }
  x.owner = this;
  x.position = u;
  x.text = t;
  x.make_mesh();
  return x;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.curve = {
  owner : null,
  enabled : 1,
  n : 48,
  t0 : 0, // minimum parameter value
  t1 : 1, // maximum parameter value
  colour : new BABYLON.Color4(1,0,0,1),
  radius : 0,
  embedding : function(t) { return [t,t,t]; }
 };

 owl3.curve.set_positions = function() {
  var f,i,x,y,mat;
  var me = this;

  f = function(t) {
   var s = me.t0 + t * (me.t1 - me.t0);
   var u = me.embedding(s);
   var x = me.owner.transform(u);
   return x;
  }

  this.positions = [];
  for (i = 0; i <= this.n; i++) {
   x = f((i * 1.)/this.n);
   y = new BABYLON.Vector3(x[0],x[1],x[2]);
   this.positions.push(y);
  }
 };

 owl3.curve.make_mesh = function() {
  var f,i,x,y,mat;
  var me = this;

  if (this.mesh) {
   this.owner.scene.removeMesh(this.mesh);
   this.mesh.dispose();
  }

  this.set_positions();

  if (this.radius) {
   this.mesh = BABYLON.MeshBuilder.CreateTube(
    this.name, {path: this.positions,
		radius: this.radius,
		cap: BABYLON.Mesh.CAP_ALL,
		updateable: true}, this.owner.scene);

   mat = new BABYLON.StandardMaterial("mat", this.owner.scene);
   mat.diffuseColor  = this.colour;
   this.mesh.material = mat;
  } else {
   this.cols = Array(this.positions.length).fill(this.colour);
   this.mesh = BABYLON.MeshBuilder.CreateLines(
    null,
    {points : this.positions, colors : this.cols, alpha : 1, updatable : true},
    this.owner.scene
   );
  } 

  this.mesh.setEnabled(this.enabled);
  return this.mesh;
 };

 owl3.curve.update_mesh = function() {
  this.make_mesh();
 };

 owl3.curve.set_enabled = function(b) {
  this.enabled = b;
  this.mesh.setEnabled(b);
 };

 //////////////////////////////////////////////////////////////////////

 owl3.line = Object.create(owl3.curve);
 owl3.line.n = 2;
 owl3.line.a = [0,0,0];
 owl3.line.b = [1,1,1];

 owl3.line.embedding = function(t) {
  return vec.add(vec.smul(1-t,this.a),vec.smul(t,this.b));
 };

 owl3.make_line = function(a,b,c,r) {
  var x = Object.create(owl3.line);

  x.owner = this;
  x.a = a;
  x.b = b;
  x.colour = this.col4(c);
  x.radius = r;
  x.make_mesh();

  return x;
 };

 owl3.make_thin_line = function(a,b,c) {
  return this.make_line(a,b,c,0);
 };

 //////////////////////////////////////////////////////////////////////

 owl3.circle = Object.create(owl3.curve);

 owl3.circle.c = [0,0,0];
 owl3.circle.u = [1,0,0];
 owl3.circle.v = [0,1,0];

 owl3.circle.embedding = function(t) {
  var ct = Math.cos(2 * Math.PI * t);
  var st = Math.sin(2 * Math.PI * t);
  var x = [this.c[0] + ct * this.u[0] + st * this.v[0],
	   this.c[1] + ct * this.u[1] + st * this.v[1],
	   this.c[2] + ct * this.u[2] + st * this.v[2]
	  ];
  return x;
 };

 owl3.make_circle = function(c,u,v,r) {
  var x = Object.create(this.circle);

  x.owner = this;
  x.c = c;
  x.u = u;
  x.v = v;
  x.radius = r;
  x.make_mesh();

  return x;
 };

 owl3.make_thin_circle = function(c,u,v) {
  return this.make_circle(c,u,v,0);
 };

 //////////////////////////////////////////////////////////////////////

 owl3.sphere_arc = Object.create(owl3.curve);

 owl3.sphere_arc.c = [ 0,0,0];
 owl3.sphere_arc.a = [-1,0,0];
 owl3.sphere_arc.b = [ 1,0,0];
 owl3.sphere_arc.u = [ 0,1,0];
 owl3.sphere_arc.v = [ 1,0,0];
 owl3.sphere_arc.theta = Math.PI;

 owl3.sphere_arc.set_ends = function(a,b) {
  this.c = [0,0,0];
  this.a = vec.hat(a);
  this.b = vec.hat(b);
  this.u = vec.hat(vec.add(this.b,this.a));
  this.v = vec.hat(vec.sub(this.b,this.a));
  this.theta = 2 * Math.asin(vec.dp(this.b,this.v));
 };

 owl3.sphere_arc.embedding = function(t) {
  var phi = this.theta * (t - 0.5);
  var x = vec.add(this.c,
		  vec.add(vec.smul(Math.cos(phi),this.u),
			  vec.smul(Math.sin(phi),this.v)));
  return x;
 };

 owl3.make_sphere_arc = function(a,b,r) {
  var x = Object.create(this.sphere_arc);
  x.owner = this;
  x.set_ends(a,b);
  x.radius = r;
  x.make_mesh();

  return x;
 };

 owl3.make_thin_sphere_arc = function(a,b) {
  return this.make_sphere_arc(a,b,0);
 };

 //////////////////////////////////////////////////////////////////////

 owl3.polygon = {
  owner : null,
  enabled : 1,
  v : [[1,0,0],[0,0,1],[0,1,0]],
  colour : new BABYLON.Color4(0.5,0.5,1,1)
 };

 owl3.polygon.make_mesh = function() {
  var grid = new BABYLON.VertexData();
  grid.positions = owl.flat(this.v.map(this.owner.transform));
  var n = this.v.length;
  grid.indices = [];
  for (i = 1; i < n - 1; i++) {
   grid.indices.push(0,i,i+1);
  }

  if (this.mesh) {
   this.owner.scene.removeMesh(this.mesh);
   this.mesh.dispose();
  }

  this.mesh = new BABYLON.Mesh(null,this.owner.scene);
  this.owner.set_colour(this.mesh,this.colour);
  grid.applyToMesh(this.mesh);
  this.mesh.setEnabled(this.enabled);

  return this.mesh;
 };

 owl3.polygon.set_enabled = function(b) {
  this.enabled = b;
  this.mesh.setEnabled(b);
 };

 owl3.make_polygon = function(v,c) {
  var x = Object.create(this.polygon);
  x.owner = this;
  x.v = v;
  if (arguments.length > 1) {
   x.colour = this.col4(c);
  }
  x.make_mesh();

  return x;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.complex = {
  owner     : null,
  enabled   : 1,
  vertices  : [],
  edges     : [],
  faces     : [],
  embedding : {},
  separate_faces : 0,
  colour    : new BABYLON.Color4(0.5,0.5,1,1)
 };

 owl3.complex.make_mesh = function() {
  this.mesh = new BABYLON.Mesh(null,this.scene);

  var vi = {};
  for (var i = 0; i < this.vertices.length; i++) {
   vi[this.vertices[i]] = i;
  }

  if (this.separate_faces) {
   this.face_meshes = [];
   for (f of this.faces) {
    var m = new BABYLON.Mesh(null,this.owner.scene);
    m.parent = this.mesh;
    this.face_meshes.push(m);
    var grid = new BABYLON.VertexData();
    var v = [];
    for (x of f) {
     v.push(this.owner.transform(this.embedding[x]));
    }
    grid.positions = owl.flat(v);
    grid.indices = [0,1,2];
    var n = [];
    BABYLON.VertexData.ComputeNormals(grid.positions, grid.indices, n);
    grid.normals = n;
    grid.applyToMesh(m);
    this.owner.set_colour(this.faces_mesh,this.colour);
   }
  } else {
   this.faces_mesh = new BABYLON.Mesh(null,this.owner.scene);
   this.faces_mesh.parent = this.mesh;
   var grid = new BABYLON.VertexData();

   var v = [];
   for (var i = 0; i < this.vertices.length; i++) {
    v.push(this.owner.transform(this.embedding[this.vertices[i]]));
   }

   grid.positions = owl.flat(v);
   grid.indices = owl.flat(this.faces).map(x => vi[x]);
   var n = [];
   BABYLON.VertexData.ComputeNormals(grid.positions, grid.indices, n);
   grid.normals = n;
   grid.applyToMesh(this.faces_mesh);
   this.owner.set_colour(this.faces_mesh,this.colour);
  }

  this.mesh.setEnabled(this.enabled);

  return this.mesh;
 };

 owl3.complex.set_enabled = function(b) {
  this.enabled = b;
  this.mesh.setEnabled(b);
 };

 owl3.make_complex = function() {
  var x = Object.create(this.complex);
  x.owner = this;
  return x;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.surface = {
  owner : null,
  enabled : 1,
  name : 'surface',
  n : 48,
  m : 48,
  colour : new BABYLON.Color4(0.5,0.5,1,1),
  t0 : 0,
  t1 : 1,
  u0 : 0,
  u1 : 1,
  embedding : function(t,u) {
   return [t,u,0];
  },
  normal : null,
  uv : null
 };

 owl3.surface.n = 48;
 owl3.surface.m = 48;
 owl3.surface.colour = {r : 0.5, g : 0.5, b : 1};

 owl3.surface.set_fg = function() {
  var me = this;

  this.f = function(t,u) {
   var tt = me.t0 + t * (me.t1 - me.t0);
   var uu = me.u0 + u * (me.u1 - me.u0);
   var xx = me.embedding(tt,uu);
   return xx;
  }

  if (this.normal) {
   this.g = function(t,u) {
    var tt = me.t0 + t * (me.t1 - me.t0);
    var uu = me.u0 + u * (me.u1 - me.u0);
    var nn = me.normal(tt,uu);
    return nn;
   }
  } else {
   this.g = null;
  }

  if (this.uv) {
   this.h = function(t,u) {
    var tt = me.t0 + t * (me.t1 - me.t0);
    var uu = me.u0 + u * (me.u1 - me.u0);
    return me.uv(tt,uu);
   }
  } else if (this.uv0) {
   this.h = function(t,u) {
    return me.uv0(t,u);
   }
  } else {
   this.h = null;
  }
 };

 owl3.surface.make_mesh = function() {
  var me = this;

  this.set_fg();

  if (this.mesh) {
   this.owner.scene.removeMesh(this.mesh);
   this.mesh.dispose();
  }

  this.mesh = new BABYLON.Mesh(this.name, this.owner.scene);
  if (! this.normal) { this.normal = null; }
  if (! this.uv) { this.uv = null; }
  this.grid = this.owner.make_grid_with_normal(this.n,this.m,this.f,this.g,this.h);

  var gp = this.grid.positions;
  var gi = this.grid.indices;
  var gn = this.grid.normals;

  this.grid.applyToMesh(this.mesh,true);
  this.mesh.setEnabled(this.enabled);

  if (this.colour_function) {
   this.cols = [];
   for (i = 0; i <= this.n; i++) {
    for (j = 0; j <= this.m; j++) {
     t = (i * 1.)/this.n;
     u = (j * 1.)/this.m;
     c = this.colour_function(t,u);
     this.cols.push(c[0],c[1],c[2],c[3]);
    }
   }
   this.mesh.hasVertexAlpha = true;
   this.mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, this.cols);
   this.mesh.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
  } else {
   this.owner.set_colour(this.mesh,this.colour);
  }
 };

 owl3.surface.update_mesh = function() {
  var me = this;

  this.set_fg();

  this.grid = this.owner.make_grid_with_normal(this.n,this.m,this.f,this.g);
  this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.grid.positions);
  this.mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, this.grid.normals);
 };

 owl3.surface.set_enabled = function(b) {
  this.enabled = b;
  this.mesh.setEnabled(b);
 };

 //////////////////////////////////////////////////////////////////////
 // Standard embedding of a 3-simplex as a regular tetrahedron.

 owl3.tetrahedron_embedding = function(t) {
  return [Math.sqrt(2)*(2*t[1]-t[2]-t[3])/3,
	  Math.sqrt(2/3)*(t[2]-t[3]),
	  t[0]-(t[1]+t[2]+t[3])/3];
 };

 //////////////////////////////////////////////////////////////////////

 owl3.torus = Object.create(owl3.surface);
 owl3.torus.name = 'torus';
 owl3.torus.R = 2;
 owl3.torus.r = 1;

 owl3.torus.embedding = function(t,u) {
  var tau = 2 * Math.PI;
  var cu = Math.cos(tau * u);
  var su = Math.sin(tau * u);
  var ct = Math.cos(tau * t);
  var st = Math.sin(tau * t);
  return [(this.R+this.r*cu)*ct,
	  this.r*su,
	  (this.R+this.r*cu)*st];
 };

 owl3.torus.normal = function(t,u) {
  var tau = 2 * Math.PI;
  var cu = Math.cos(tau * u);
  var su = Math.sin(tau * u);
  var ct = Math.cos(tau * t);
  var st = Math.sin(tau * t);
  return [cu*ct,su,cu*st];
 };

 owl3.make_torus = function(R,r) {
  var x = Object.create(this.torus);
  x.owner = this;
  if (arguments.length > 0) { x.R = R; }
  if (arguments.length > 1) { x.r = r; }
  x.make_mesh();
  return x;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.cylinder = Object.create(owl3.surface);
 owl3.cylinder.name = 'cylinder';
 owl3.cylinder.r = 2;
 owl3.cylinder.h = 4;

 owl3.cylinder.embedding = function(t,u) {
  return [this.r * Math.cos(2 * Math.PI * t),
	  (u - 0.5) * this.h,
	  this.r * Math.sin(2 * Math.PI * t)];
 };

 owl3.cylinder.normal = function(t,u) {
  return [Math.cos(2 * Math.PI * t),
	  0,
	  Math.sin(2 * Math.PI * t)];
 };

 owl3.make_cylinder = function(r,h) {
  var x = Object.create(this.cylinder);
  x.owner = this;
  if (arguments.length > 0) { x.r = r; }
  if (arguments.length > 1) { x.h = h; }
  x.make_mesh();
  return x;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.sphere = Object.create(owl3.surface);
 owl3.sphere.name = 'sphere';
 owl3.sphere.r = 3;

 owl3.sphere.normal = function(t,u) {
  var cu = Math.cos(2 * Math.PI * u);
  var su = Math.sin(2 * Math.PI * u);
  var ct = Math.cos(Math.PI * t);
  var st = Math.sin(Math.PI * t);
  return [st*cu, ct, st*su];
 };

 owl3.sphere.embedding = function(t,u) {
  var x = this.normal(t,u);
  return [this.r * x[0], this.r * x[1], this.r * x[2]];
 };

 owl3.make_sphere = function(r) {
  var x = Object.create(this.sphere);
  x.owner = this;
  if (arguments.length > 0) { x.r = r; }
  x.make_mesh();
  return x;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.mobius = Object.create(owl3.surface);
 owl3.mobius.name = 'mobius';
 owl3.mobius.R = 3;
 owl3.mobius.r = 1;
 owl3.mobius.n = 128;

 owl3.mobius.embedding = function(t,u) {
  var c2 = Math.cos(2 * Math.PI * t);
  var s2 = Math.sin(2 * Math.PI * t);
  var c4 = c2 * c2 - s2 * s2;
  var s4 = 2 * c2 * s2;
  return [(this.R + this.r * u * c2) * c4,
	  this.r * u * s2,
	  (this.R + this.r * u * c2) * s4];
 };

 owl3.mobius_normal = function(t,u) {
  var c = Math.cos(2 * Math.PI * t);
  var s = Math.sin(2 * Math.PI * t);
  var r = this.r;
  var R = this.R;
  var n = [(8*s*t^2-4*s)*r*R+(8*s*t^3-8*s*t)*u*r^2,
	   -4*r^2*t^2*u-4*R*r*t,
	   (-8*t^3+8*t)*r*R+(-8*t^4+12*t^2-2)*u*r^2 ];
  var nn = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
  n = [- n[0] / nn, - n[1] / nn, - n[2] / nn];
  return n;
 };

 owl3.make_mobius = function(R,r) {
  var x = Object.create(this.mobius);
  x.owner = this;
  if (arguments.length > 0) { x.R = R; }
  if (arguments.length > 1) { x.r = r; }
  x.make_mesh();
  return x;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.klein = Object.create(owl3.surface);
 owl3.klein.a = 0.4;
 owl3.klein.b = 0.6;
 owl3.klein.c = 0.3;
 owl3.klein.n = 128;
 owl3.klein.m = 32;

 owl3.klein.embedding = function(t,u) {
  var cu = Math.cos(2 * Math.PI * u);
  var su = Math.sin(2 * Math.PI * u);
  var c1 = Math.cos(    Math.PI * t);
  var c2 = Math.cos(2 * Math.PI * t);
  var c3 = Math.cos(3 * Math.PI * t);
  var c4 = Math.cos(4 * Math.PI * t);
  var s1 = Math.sin(    Math.PI * t);
  var s2 = Math.sin(2 * Math.PI * t);
  var s3 = Math.sin(3 * Math.PI * t);
  var s4 = Math.sin(4 * Math.PI * t);

  var x = (0.1*s3+0.1*s1+0.4*c1)*su-0.5*s4+s2;
  var y = 0.2*su*s3+2.*c2+0.5;
  var z = 0.25*cu*s2+0.4*cu;
  return [-x,z,y];
 };

 owl3.make_klein = function(R,r) {
  var x = Object.create(this.klein);
  x.owner = this;
  if (arguments.length > 0) { x.a = a; }
  if (arguments.length > 1) { x.b = b; }
  if (arguments.length > 2) { x.c = c; }
  x.make_mesh();
  return x;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.boys = Object.create(owl3.surface);

 owl3.boys.coeffs =
  [[0.19841, 0, 0, 0.13226, 0.31036, 0, 0, 0.05120, 0.03890],
   [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, -0.60213, -0.37851, 0, 0, -0.00688, 0.15039, 0, 0],
   [0.30612, 0, 0, -0.25597, -0.26741, 0, 0, -0.06826, -0.05186],
   [0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, -0.13195, -0.06075, 0, 0, 0.00344, -0.07520, 0, 0],
   [0.07282, 0, 0, 0.12371, -0.04294, 0, 0, 0.01706, 0.01297]];

 owl3.boys.embedding0 = function(t,u) {
  var t0 = Math.PI * t / 2;
  var u0 = Math.PI * u * 2; 
  var Bt = [1,Math.sin(t0),Math.cos(t0),Math.sin(2*t0),Math.cos(2*t0),
	    Math.sin(3*t0),Math.cos(3*t0),Math.sin(4*t0),Math.cos(4*t0)];
  var Bu = [1,Math.sin(u0),Math.cos(u0),Math.sin(2*u0),Math.cos(2*u0),
	    Math.sin(3*u0),Math.cos(3*u0),Math.sin(4*u0),Math.cos(4*u0)];

  var v = 0;
  for (var i = 0; i < 9; i++) {
   for (var j = 0; j < 9; j++) {
    v += this.coeffs[i][j] * Bt[i] * Bu[j];
   }
  }

  return v;
 };

 owl3.boys.embedding = function(t,u) {
  return [
   this.embedding0(t,u),
   this.embedding0(t,u+1/3),
   this.embedding0(t,u+2/3)
  ];
 };

 owl3.make_boys = function() {
  var x = Object.create(this.boys);
  x.owner = this;
  x.make_mesh();
  return x;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.trefoil = Object.create(owl3.surface);
 owl3.trefoil.R = 1;
 owl3.trefoil.r = 0.1;

 owl3.trefoil.frame = function(t0) {
  var t = 2 * Math.PI * t0;
  var sin = Math.sin;
  var cos = Math.cos;
  var x = [sin(t) + 2*sin(2*t),cos(t) - 2 * cos(2*t),-sin(3*t)];
  var y = [72*sin(2*t)+3*sin(8*t)-13*sin(4*t)+3*sin(7*t)-14*sin(5*t)+3*sin(t),
	3*cos(t)-3*cos(8*t)+3*cos(7*t)-72*cos(2*t)+14*cos(5*t)-13*cos(4*t),
	10*sin(6*t)-34*sin(3*t)];
  var z = [-391*cos(t)+2*cos(8*t)-29*cos(7*t)+
	   85*cos(2*t)-99*cos(5*t)+24*cos(4*t)+9*cos(10*t)-9*cos(11*t),
	   -9*sin(11*t)+29*sin(7*t)+85*sin(2*t)-9*sin(10*t)+
	   2*sin(8*t)-24*sin(4*t)-99*sin(5*t)+391*sin(t),
	   -570-34*cos(3*t)-94*cos(6*t)+18*cos(9*t)];
  var ny = Math.sqrt(y[0]*y[0] + y[1]*y[1] + y[2]*y[2]);
  var nz = Math.sqrt(z[0]*z[0] + z[1]*z[1] + z[2]*z[2]);
  y = [y[0]/ny, y[1]/ny, y[2]/ny];
  z = [z[0]/nz, z[1]/nz, z[2]/nz];

  return {'x' : x, 'y' : y, 'z' : z};
 };

 owl3.trefoil.embedding = function(t0,u0) {
  var f = this.frame(t0);

  var cu = Math.cos(2 * Math.PI * u0);
  var su = Math.sin(2 * Math.PI * u0);
  return [this.R * f.x[0] + this.r * (cu * f.y[0] + su * f.z[0]),
	  this.R * f.x[1] + this.r * (cu * f.y[1] + su * f.z[1]),
	  this.R * f.x[2] + this.r * (cu * f.y[2] + su * f.z[2])];
 };

 owl3.trefoil.normal = function(t0,u0) {
  var f = this.frame(t0);

  var cu = Math.cos(2 * Math.PI * u0);
  var su = Math.sin(2 * Math.PI * u0);
  return [(cu * f.y[0] + su * f.z[0]),
	  (cu * f.y[1] + su * f.z[1]),
	  (cu * f.y[2] + su * f.z[2])];
 };

 owl3.make_trefoil = function(R,r) {
  var x = Object.create(this.trefoil);
  x.owner = this;
  if (arguments.length > 0) { x.R = R; }
  if (arguments.length > 1) { x.r = r; }
  x.make_mesh();
  return x;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.simplex3_embedding = function(t) {
  var u0 = 0.943*t[1]-0.471*t[2]-0.471*t[3];
  var u1 = 0.816*t[2]-0.816*t[3];
  var u2 = t[0]-0.333*t[1]-0.333*t[2]-0.333*t[3];
  var u = [u0,u2,u1];
  return u;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.make_axes_box = function(opts) {

  var opts0 = {
   x0 : -2, x1 : 1, y0 : -2, y0 : 1, z0 : 0, z1 : 2,
   colour : [0,0,0]
  }

  if (opts) {
   Object.assign(opts0,opts);
  }

  var x0 = opts0.x0; var x1 = opts0.x1;
  var y0 = opts0.y0; var y1 = opts0.y1;
  var z0 = opts0.z0; var z1 = opts0.z1;

  var L = [
   [[x0,y0,z0],[x1,y0,z0]],
   [[x0,y0,z0],[x0,y1,z0]],
   [[x0,y0,z0],[x0,y0,z1]],
   [[x0,y1,z1],[x1,y1,z1]],
   [[x1,y0,z1],[x1,y1,z1]],
   [[x1,y1,z0],[x1,y1,z1]],
   [[x1,y0,z0],[x1,y1,z0]],
   [[x1,y0,z0],[x1,y0,z1]],
   [[x0,y1,z0],[x1,y1,z0]],
   [[x0,y1,z0],[x0,y1,z1]],
   [[x0,y0,z1],[x1,y0,z1]],
   [[x0,y0,z1],[x0,y1,z1]]
  ];

  var axes = {};
  axes.mesh = new BABYLON.Mesh(null,this.scene);
  axes.lines = [];

  for (var u of L) {
   var l = this.make_thin_line(u[0],u[1],opts0.colour);
   l.mesh.parent = axes.mesh;
   axes.lines.push(l);
  }

  return axes;
 };

 //////////////////////////////////////////////////////////////////////

 owl3.make_axes_cross = function(opts) {

  var opts0 = {
   x0 : -2, x1 : 1, y0 : -2, y0 : 1, z0 : 0, z1 : 2,
   colour : [0,0,0]
  }

  if (opts) {
   Object.assign(opts0,opts);
  }

  var x0 = opts0.x0; var x1 = opts0.x1;
  var y0 = opts0.y0; var y1 = opts0.y1;
  var z0 = opts0.z0; var z1 = opts0.z1;

  var L = [
   [[x0, 0, 0],[x1, 0, 0]],
   [[ 0,y0, 0],[ 0,y1, 0]],
   [[ 0, 0,z0],[ 0, 0,z1]]
  ];

  var axes = {};
  axes.mesh = new BABYLON.Mesh(null,this.scene);
  axes.lines = [];

  for (var u of L) {
   var l = this.make_thin_line(u[0],u[1],opts0.colour);
   l.mesh.parent = axes.mesh;
   axes.lines.push(l);
  }

  return axes;
 };


 //////////////////////////////////////////////////////////////////////

 //////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////

 owl2.node = function (t) {
  return document.createElementNS('http://www.w3.org/2000/svg', t);
 };

 owl2.group = function () {
  return this.node('g');
 };

 owl2.line = function (x1, y1, x2, y2, color, thickness) {
  var n = this.node('line');
  n.setAttribute('x1', x1);
  n.setAttribute('y1', y1);
  n.setAttribute('x2', x2);
  n.setAttribute('y2', y2);
  n.setAttribute('stroke', color);
  n.setAttribute('stroke-width', thickness);
  n.setAttribute('fill', 'none');
  return n;
 };

 owl2.hline = function (x1, x2, y, color, thickness) {
  return this.line(x1, y, x2, y, color, thickness);
 };

 owl2.vline = function (x, y1, y2, color, thickness) {
  return this.line(x, y1, x, y2, color, thickness);
 };

 owl2.rect = function(x0,y0,w,h,color,thickness) {
  var n = this.node('rect');
  n.setAttribute('x', x0);
  n.setAttribute('y', y0);
  n.setAttribute('width', w);
  n.setAttribute('height', h);
  n.setAttribute('stroke',color);
  n.setAttribute('stroke-width', thickness);
  n.setAttribute('fill', 'none');
  return n
 };

 owl2.frect = function(x0,y0,w,h,color) {
  var n = this.node('rect');
  n.setAttribute('x', x0);
  n.setAttribute('y', y0);
  n.setAttribute('width', w);
  n.setAttribute('height', h);
  n.setAttribute('stroke','none');
  n.setAttribute('fill', color);
  return n
 };

 owl2.points_string = function(points) {
  var n,i,m,u,s,point_strings;

  point_strings = [];
  for (i in points) {
   u = points[i];
   if (Array.isArray(u)) {
    point_strings.push('' + u[0] + ',' + u[1]);
   } else {
    point_strings.push('' + u.x + ',' + u.y);   
   }
  }

  s = 'M ' + point_strings[0] + ' L ';
  for (i = 1; i < point_strings.length; i++) {
   s += point_strings[i] + ' ';
  }

  return s;
 };

 owl2.lines = function(points,color,thickness) {
  var n,i,m,u,s,point_strings;
  n = this.node('path');
  n.setAttribute('stroke',color);
  n.setAttribute('stroke-width',thickness);
  n.setAttribute('fill','none');

  s = this.points_string(points);
  n.setAttribute('d',s);

  return n;
 };

 owl2.polygon = function(points,color) {
  var n,i,m,u,s,point_strings;
  n = this.node('path');
  n.setAttribute('stroke','none');
  n.setAttribute('fill',color);

  m = points.length;
  s = this.points_string(points);
  n.setAttribute('d',s);

  return n;
 };

 owl2.circle = function(x0,y0,r,color,thickness) {
  var n = this.node('circle');
  n.setAttribute('cx', x0);
  n.setAttribute('cy', y0);
  n.setAttribute('r', r);
  n.setAttribute('stroke', color);
  n.setAttribute('stroke-width',thickness);
  n.setAttribute('fill', 'none');
  return n
 };

 owl2.disc = function(x0,y0,r,color) {
  var n = this.node('circle');
  n.setAttribute('cx', x0);
  n.setAttribute('cy', y0);
  n.setAttribute('r', r);
  n.setAttribute('stroke','none');
  n.setAttribute('fill', color);
  return n
 };

 owl2.text = function(s,x,y) {
  var n = this.node('text');
  n.setAttribute('text-anchor','middle');
  n.setAttribute('alignment-baseline','middle');
  n.setAttribute('font-size','24px');
  n.setAttribute('fill','black');
  n.setAttribute('x', x);
  n.setAttribute('y', y);
  n.textContent = s;
  return n; 
 };

 owl2.math_text = function(s,x,y) {
  var n = this.node('text');
  n.setAttribute('text-anchor','middle');
  n.setAttribute('alignment-baseline','middle');
  n.setAttribute('font-size','24px');
  n.setAttribute('font-family',comb.math_font);
  n.setAttribute('fill','black');
  n.setAttribute('x', x);
  n.setAttribute('y', y);
  n.setAttribute('pointer-events','none');
  n.textContent = s;
  return n; 
 };

 owl2.append_tspan = function(t,s) {
  var u = this.node('tspan');
  u.textContent = s;
  t.appendChild(u);
  return u;
 };

 //////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////

 owl.demo = {};

 owl.demo.find_ids = function(ids) {
  var i,id,ids0,x;

  ids0 = ['frame','main_div','main_svg','msg_div','youtube_button',
	  'main_canvas','stage_slider'];

  if (ids !== undefined) {
   ids0 = ids.concat(ids0);
  }

  for (i in ids0) {
   id = ids0[i];

   x = document.getElementById(id);
   if (id && x) { this[id] = x; } 
  }

  this.activate_youtube_button();
 };

 //////////////////////////////////////////////////////////////////////

 owl.demo.activate_youtube_button = function() {
  if (! this.name) { return; }

  if (typeof youtube_keys === 'undefined') { return; }

  var key = youtube_keys[this.name];

  if (! key) { return; }

  var x = document.getElementById('youtube_button');
  if (! x) { return; }

  var me = this;

  x.onclick = function() { window.open('https://youtu.be/' + key); };
 };

 //////////////////////////////////////////////////////////////////////

 owl.demo.get_offset = function( el ) {
  var _x = 0;
  var _y = 0;
  while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
   _x += el.offsetLeft - el.scrollLeft;
   _y += el.offsetTop - el.scrollTop;
   el = el.offsetParent;
  }
  return { top: _y, left: _x };
 };

 owl.demo.set_msg = function(s) {
  this.msg_div.innerHTML = s;
  MathJax.Hub.Queue(['Typeset',MathJax.Hub,this.msg_div]);
 };

 return owl;
});

 
