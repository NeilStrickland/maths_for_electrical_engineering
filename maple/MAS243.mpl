cd := currentdir():
libname:="D:/Program Files/JavaViewLib",libname:
with(plots):
with(plottools):
with(LinearAlgebra):
with(JavaViewLib):
_EnvAllSolutions := true:
_EnvExplicit := true:

axes_box := proc(x,y,z)
 local x0,x1,y0,y1,z0,z1;
 if type(x,`..`) then
  x0 := op(1,x); x1 := op(2,x);
 else
  x0 := 0; x1 := x;
 fi;
 if type(y,`..`) then
  y0 := op(1,y); y1 := op(2,y);
 else
  y0 := 0; y1 := y;
 fi;
 if type(z,`..`) then
  z0 := op(1,z); z1 := op(2,z);
 else
  z0 := 0; z1 := z;
 fi;
 return(display(
  line([x0,y0,z0],[x1,y0,z0],colour=black),
  line([x1,y0,z0],[x1,y1,z0],colour=black),
  line([x1,y1,z0],[x0,y1,z0],colour=black),
  line([x0,y1,z0],[x0,y0,z0],colour=black),
  line([x0,y0,z1],[x1,y0,z1],colour=black),
  line([x1,y0,z1],[x1,y1,z1],colour=black),
  line([x1,y1,z1],[x0,y1,z1],colour=black),
  line([x0,y1,z1],[x0,y0,z1],colour=black),
  line([x0,y0,z0],[x0,y0,z1],colour=black),
  line([x1,y0,z0],[x1,y0,z1],colour=black),
  line([x0,y1,z0],[x0,y1,z1],colour=black),
  line([x1,y1,z0],[x1,y1,z1],colour=black)
 ));
end:

axes_cross := proc(x,y,z)
 local x0,x1,y0,y1,z0,z1;
 if type(x,`..`) then
  x0 := op(1,x); x1 := op(2,x);
 else
  x0 := -x; x1 := x;
 fi;
 if type(y,`..`) then
  y0 := op(1,y); y1 := op(2,y);
 else
  y0 := -y; y1 := y;
 fi;
 if type(z,`..`) then
  z0 := op(1,z); z1 := op(2,z);
 else
  z0 := -z; z1 := z;
 fi;
 return(display(
  line([x0,0,0],[x1,0,0],colour=black),
  line([0,y0,0],[0,y1,0],colour=black),
  line([0,0,z0],[0,0,z1],colour=black)
 ));
end:


save_pdf := proc(s) 
 local P,old_dir,cmd,ret;
 P := eval(convert(s,name));
 old_dir := currentdir("U:/Teach/MAS243/notes/images/");
 plotsetup(ps,
  plotoutput=cat(s,".eps"),
  plotoptions=
   "shrinkby=0.1,leftmargin=0cm,bottommargin=0cm,width=5cm,height=1cm,noborder,portrait"
 );
 print(P);
 plotsetup(default);
 cmd := cat("gs -q -dNOPAUSE -dSAFER -sOutputFile=",s,".pdf",
            " -sDEVICE=pdfwrite ",file_name,".eps quit.ps");
 ret := ssystem(cmd);
 currentdir(old_dir);
 [cmd,op(ret)];
end:

save_jpg := proc(s,w_,h_,dest_) 
 local P,old_dir,w,h;
 P := eval(convert(s,name));
 w := `if`(nargs>1,w_,1000);
 h := `if`(nargs>2,h_,500);
 if nargs>3 and dest_ = "lectures" then 
  old_dir := currentdir("U:/Teach/MAS243/lectures/images/");
 elif nargs>3 and dest_ = "probs" then 
  old_dir := currentdir("U:/Teach/MAS243/probs/images/");
 else 
  old_dir := currentdir("U:/Teach/MAS243/notes/images/");
 fi;
 plotsetup(jpeg,
  plotoutput=cat(s,".jpg"),
  plotoptions=sprintf("height=%d,width=%d",h,w)
 );
 print(P);
 plotsetup(default);
 currentdir(old_dir);
end: 

save_mpl := proc(s) 
 local P,f;
 P := eval(convert(s,name));
 f := cat("C:/www/webroot/pm1nps/courses/MAS243/pics/",s,".mpl");
 exportMPL(P,f);
 NULL;
end: 

save_jvx := proc(s) 
 local P,f;
 P := eval(convert(s,name));
 f := cat("C:/www/webroot/pm1nps/courses/MAS243/pics/",s,".jvx");
 exportJVX(P,f);
 NULL;
end: 


proj_setup := proc(t,p)
 global a,b;
 local theta,phi;
 theta := evalf(t*Pi/180);
 phi := evalf(p*Pi/180);
 a := evalf([-cos(phi)*sin(theta),cos(phi)*cos(theta),sin(phi)]):
 b := evalf([cos(theta),sin(theta),0]):
end:
proj_setup(190,103):
vproj := 
(v) -> [v[1]*b[1]+v[2]*b[2]+v[3]*b[3],v[1]*a[1]+v[2]*a[2]+v[3]*a[3]]:
cproj := proc()
 local L,a;
 L := NULL:
 for a in args do 
  if type(a,list(list(numeric))) then
   L := L,map(vproj,a);
  elif type(a,hfarray) then
   L := L,hfarray(map(vproj,convert(a,listlist)));
  else 
   L := L,a;
  fi;
 od:
 CURVES(L);
end:
pproj := proc()
 local L,a;
 L := NULL:
 for a in args do 
  if type(a,list(list(numeric))) then
   L := L,map(vproj,a);
  elif type(a,hfarray) then
   L := L,hfarray(map(vproj,convert(a,listlist)));
  else
   L := L,a;
  fi;
 od:
 POLYGONS(L);
end:
tproj := (v,s) -> TEXT(vproj(v),s):
zproj := () -> NULL:
proj := (u) -> eval(subs({PLOT3D=PLOT,CURVES=cproj,POLYGONS=pproj,TEXT=tproj,
                          VIEW=zproj,ORIENTATION=zproj},u)):

tikz := proc(u)
 local j,s,t,v,w;
 s := "\\begin{tikzpicture}\n";
 for v in u do
  if op(0,v) = CURVES then
   j := "";
   s := cat(s," \\draw ");
   for w in op(1,v) do
    t := sprintf("(%.3f,%.3f)",w[1],w[2]);
    s := cat(s,j,t);
    j := " -- ";
   od;
   s := cat(s,";\n");
  elif op(0,v) = POLYGONS then
   j := "";
   s := cat(s," \\fill ");
   for w in op(1,v) do
    t := sprintf("(%.3f,%.3f)",w[1],w[2]);
    s := cat(s,j,t);
    j := " -- ";
   od;
   s := cat(s,";\n");
  fi;
 od;
 s := cat(s,"\\end{tikzpicture}\n");
 printf(s);
end:

IsReal := proc(t) type(t,numeric) and abs(evalf(Im(t))) < 10.^(-6); end:

currentdir(cd):
