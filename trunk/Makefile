VER = $(shell cat version.txt)

DIR = ../ce-mobile-crm-${VER}
MAX = Application.js
MIN = Application.min.js
CSS = style.css
CSSMIN = style.min.css
ZIP = ${DIR}.zip

JSFILES = js/Accounts.js \
  js/Application.js \
  js/Calls.js \
  js/Contacts.js \
  js/Leads.js \
  js/Md5.js \
  js/Meetings.js \
  js/Notes.js \
  js/Opportunities.js \
  js/SearchByModule.js \
  js/Tasks.js \
  js/jquery.mobile-config.js \

CSSFILES = css/style.css \

build: cssmin jsmin deploy usemin rmmax zip

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
	@@cp -R theme/ ${DIR}/theme/
	@@cp -R l10n/ ${DIR}/l10n/
	@@rm ${DIR}/theme/ce-mobile-crm.css
	@@cp js/jquery.mobile-config.js ${DIR}/js/
	@@cp -R images/ ${DIR}/images/
	@@sed -e '/<!-- JS BEGIN -->/{:z;N;/<!-- JS END -->/!bz;d}' index.html > ${DIR}/index.html
	@@cp .htaccess ${DIR}
	@@cp README.TXT ${DIR}
	@@find ${DIR} -name ".svn" | xargs rm -Rf

usemin:
	@@sed -e 's/style.css/style.min.css/' ${DIR}/index.html > ${DIR}/index.html.tmp
	@@sed -e 's/Application.js/Application.min.js/' ${DIR}/index.html.tmp > ${DIR}/index.html.tmp2
	@@java -jar build/htmlcompressor-1.5.3.jar ${DIR}/index.html.tmp2 > ${DIR}/index.html
	@@rm  ${DIR}/index.html.tmp
	@@rm  ${DIR}/index.html.tmp2

rmmax:
	@@rm  ${DIR}/js/Application.js
	@@rm  ${DIR}/css/style.css

zip:
	@@zip -rq ${ZIP} ${DIR}

