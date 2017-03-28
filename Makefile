deploy:
	#rsync -ravp shots axcoto:sites/chi-playground/
	rsync -ravp copvan/public/ axcoto:public/kolor.ml/
	ssh axcoto "chmod -R g+rx public/kolor.ml"
