<h1># Logbook-Web-App</h1>

<p>Logbook app. goal is to store data from a real logbook.
Firebase and other related technologies have been used to develop logbook app.
Please refer to firebase documentation: https://firebase.google.com/docs/guides/</p>
<hr>
<hr>

<h3>Web-App versions:</h3>
<ul>
  <li>lobbook-v0.0.5 (*)</li>
  <li>lobbook-v0.0.4</li>
  <li>logbook-v0.0.3</li>
  <li>logbook-v0.0.2</li>
  <li>logbook-v0.0.1</li>
</ul>

<p><b>(*) Note:</b>&nbsp;this is the current last version of logbook</p>

<p>(IDE: VS Code)</p>
<hr>

<h3>Web App - HTML, JAVSCRIPT</h3>

<p>To use the code you might need to install firbase from npm:
  $ npm install firebase@<version> --save
  (please refer to firebase documentation: https://firebase.google.com/docs/firestore/)</p>


<h4>v0.0.5</h4>
<p>A new TimeManager utility class added to the project and small changes due to the usage of the functions availabe in the TimeManager class. This avoids those errors that happened in the previous versions of the <i>privateCalculateFlightTime</i> method of the <i>Crud</i> class when calculating arrival / departure time span</p>

<h4>v0.0.4</h4>
<p>Each class is in a separate file, configuration settings are in a separate file. Improved calculation of flight time.</p>

<h4>v0.0.3</h4>
<p>Revealing Module Pattern has been implemented to manage CRUD operations. This means that a few fields and methods are reveled to the public scope while others remain private and are scoped within the class only.
A Connection Manager class and a Database Manager class have been implemented too.</p>


<h4>v0.0.1 - v0.0.2</h4>
<p>First tests made to give to the web-app. CRUD operations functionalities</p>
