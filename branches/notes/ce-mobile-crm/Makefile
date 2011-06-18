
VER = $(shell cat version.txt)
SED_VER = sed "/@VERSION/${VER}/"

DIR = ce-mobile-crm-${VER}
MAX = ${DIR}.js
MIN = ${DIR}.min.js
CSS = ${DIR}.css
CSSMIN = ${DIR}.min.css

FILES = js/LanguageResources.js \
  jquery_mobile/jquery.mobile-1.0a3.js \
  js/Application.js \
  js/Accounts.js \
  js/Contacts.js \
  js/Opportunities.js \
  js/Leads.js \
  js/Calls.js \
  js/Meetings.js \
  js/Tasks.js \
  js/Notes.js \

CSSFILES = css/style.css \

all: clean mobile min deploy

clean:
	@@rm -rf ${DIR}*
	@@mkdir -p ${DIR}
	@@mkdir -p ${DIR}/css
	@@mkdir -p ${DIR}/js

css:
	@@cat ${CSSFILES} >> ${CSS}

cssmin: css
	@@java -jar build/yuicompressor-2.4.2.jar --type css ${CSS} >> ${CSSMIN}

mobile:
	@@cat ${FILES} >> ${MAX}

min: mobile
	@@java -jar build/google-compiler-20100917.jar --js ${MAX} --warning_level QUIET --js_output_file ${MIN}.tmp
	@@cat ${MIN}.tmp >> ${MIN}
	@@rm -f ${MIN}.tmp

deploy: 
	@@cp *.js ${DIR}/js/
	@@cp js/jquery-*.min.js ${DIR}/js/
	@@cp js/Md5.js ${DIR}/js/
	@@cp css/*.css ${DIR}/css/
	@@cp -R jquery_mobile/ ${DIR}/jquery_mobile/
	@@cp -R images/ ${DIR}/images/
	@@cp *.html ${DIR}/
	@@rm *.js
