VER = $(shell cat version.txt)

DIR = ce-mobile-crm-${VER}
MAX = Application.js
MIN = Application.min.js
CSS = style.css
CSSMIN = style.min.css
ZIP = ${DIR}.zip

JSFILES = js/LanguageResources.js \
  js/Application.js \
  js/Accounts.js \
  js/Contacts.js \
  js/Opportunities.js \
  js/Leads.js \
  js/Calls.js \
  js/Meetings.js \
  js/Tasks.js \
  js/Notes.js \
  js/Md5.js \

CSSFILES = css/style.css \

all: clean cssmin jsmin deploy usemin rmmax zip

testmax: clean cssmin jsmin deploy

testmin: clean cssmin jsmin deploy usemin

clean:
	@@rm -rf ${DIR}*
	@@rm -f ${ZIP}
	@@mkdir -p ${DIR}
	@@mkdir -p ${DIR}/css
	@@mkdir -p ${DIR}/js

cssmin:
	@@cat ${CSSFILES} >> ${DIR}/css/${CSS}
	@@java -jar build/yuicompressor-2.4.2.jar --type css ${DIR}/css/${CSS} >> ${DIR}/css/${CSSMIN}

jsmin:
	@@cat ${JSFILES} >> ${DIR}/js/${MAX}
	@@java -jar build/google-compiler-20100917.jar --js ${DIR}/js/${MAX} --warning_level QUIET --js_output_file ${DIR}/js/${MIN}.tmp
	@@cat ${DIR}/js/${MIN}.tmp >> ${DIR}/js/${MIN}
	@@rm -f ${DIR}/js/${MIN}.tmp

deploy: 
	@@cp -R lib/ ${DIR}/lib/
	@@cp js/jquery.mobile-config.js ${DIR}/js/
	@@cp -R images/ ${DIR}/images/
	@@sed -e '/<!-- JS BEGIN -->/{:z;N;/<!-- JS END -->/!bz;d}' index.html > ${DIR}/index.html
	@@cp .htaccess ${DIR}
	@@cp README.TXT ${DIR}
	@@find ${DIR} -name ".svn" | xargs rm -Rf

usemin:
	@@sed -e 's/style.css/style.min.css/' ${DIR}/index.html > ${DIR}/index.html.tmp
	@@sed -e 's/Application.js/Application.min.js/' ${DIR}/index.html.tmp > ${DIR}/index.html
	@@rm  ${DIR}/index.html.tmp

rmmax:
	@@rm  ${DIR}/js/Application.js
	@@rm  ${DIR}/css/style.css
	@@rm  ${DIR}/lib/jquery-1.6.2.js
	@@rm  ${DIR}/lib/jquery.mobile/jquery.mobile-1.0b2.js
	@@rm  ${DIR}/lib/jquery.mobile/jquery.mobile-1.0b2.css

zip:
	@@zip -rq ${ZIP} ${DIR}

