動かし方
=======
リポジトリをクローンしたディレクトリでコマンドプロンプトを開き  
`vagrant up`  
Tera term等で  
192.168.33.10  
vagrant/vagrant  
に接続  
`$ cd /vagrant/webApp/kanabo`  
`$ npm install --no-bin-links`  
`$ npm start`  
でサーバー起動  
http://localhost:3001/  
で画面が開きます。  

デバッグ方法
========
コンソールを2つ開きます。  
片方でnode-inspectorを起動  
cd /vagrant/webApp/kanabo`  
node-inspector`  
もう片方でアプリをデバッグ起動  
`cd /vagrant/webApp/kanabo`  
`node --debug bin/www`  
デバッグ画面は下記URLでアクセス可能  
http://localhost:48080/?ws=localhost:48080&port=5858  

自動でブラウザリロード
========
/vagrant/webApp/kanaboにて
`$ gulp`
http://192.168.33.10:9080/
で画面を開いておくと、publicディレクトリ、viewsディレクトリの中のファイルが変更された時、自動でリロードを行います。
