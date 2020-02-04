@ECHO OFF
SETLOCAL
IF EXIST D:\wamp\www\pm1nps\courses\MAS334 (
 SET WEBDIR=D:\wamp\www\pm1nps\courses\MAS334
) ELSE (
IF EXIST C:\wamp\www\courses\MAS334 (
 SET WEBDIR=C:\wamp\www\courses\MAS334
) ELSE (
 SET WEBDIR=C:\wamp\www\pm1nps\courses\MAS334
))

pdflatex all_lectures
pdflatex -job-name=all_handouts \def\HO{1} \input{all_lectures}

copy all_lectures.pdf %WEBDIR%
copy all_handouts.pdf %WEBDIR%

