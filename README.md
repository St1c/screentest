# Screen quality measurement application


Simple application for harvesting information about the end user watching conditions for use in the video and image quality assessments.

## License

This screen quality testing application is licensed under a Creative Commons Attribution 3.0 Austria License.

THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

THIS SOFTWARE IS LICENSED FOR USAGE WITHIN STUDIES AND TRIALS CONDUCTED WITH CLOSED USER GROUPS. IT IS ALSO LICENSED FOR USAGE AS PART OF A PUBLICLY ACCESSIBLE ONLINE TEST PERFORMED AS CROWDSOURCING STUDIES. IT IS NOT LICENSEd FOR ANY COMMERCIONAL USAGE. 

**ANY USE OF THIS OF THIS SOFTWARE MUST BE PROPERLY REFERENCED, AND FOLLOWING PUBLICATIONS MUST BE CITED:**

**1. Best Practices for QoE Crowdtesting: QoE Assessment with Crowdsourcing**
```
@ARTICLE{BestPractices,
  author = {Tobias Hossfeld and  Christian Keimel and  Matthias Hirth and  Bruno Gardlo and  Julian Habigt and  Klaus Diepold and  Phuoc Tran-Gia },
  journal={Multimedia, IEEE Transactions on},
  title={Best Practices for QoE Crowdtesting: QoE Assessment with Crowdsourcing}, 
  journal = {Transactions on Multimedia},
  volume = {PP},
  pages={1-1}, 
  number={99}, 
  year = {2013},
  doi={10.1109/TMM.2013.2291663}, 
  ISSN={1520-9210},
}
```
[On IEEExplore](http://ieeexplore.ieee.org/xpl/articleDetails.jsp?tp=&arnumber=6671455&searchField%3DSearch_All%26queryText%3Dbest+practices+crowdsourcing)


**2. Crowdsourcing 2.0: Enhancing Execution Speed and Reliability of Web-based QoE Testing** - submitted, in review
```
@ARTICLE{crowdsourcing20,
  author = {Bruno Gardlo and Sebastian Egger and Michael Seufert and Raimund Schatz },
  title = {Crowdsourcing 2.0: Enhancing Execution Speed and Reliability of Web-based QoE Testing},
  booktitle = {2014 IEEE International Conference on Communications},
  address = {Sydney, Australia},
  month = jun,
  year = {2014},
}
```

## Demo 

The demo of this script is available at [screen.dataworkers.eu](http://screen.dataworkers.eu).

## Functionality

### Conditions related variables 
Application offers basic information about the watching conditions at the end user side reflected by visible white and black colors, represented by `smallestNumber`, `highestNumber` and `blackStars[]` form variables, posted to the server in the `$_POST` PHP superglobal.
Together with these variables, application provides information about screen resolution (`screen` variable) and browser (`browser` variable).


### Reliability checks

Apart from the information described above, the application also provides opportunity to do background checking of user's working reliability. Below are described several tests, which together with other variables (`focustime, clickNo, clickCounter`) can be used on a server side to calculate user's reliability.

###### Screen Quality page reliability checks (max 20 points): 


| Test 					| Description 						| Points |
| --------------------------------------|-------------------------------------------------------|-------:|
| Black stars 			| Numbers in stars array are not consecutive or 0 		| 1  	 |
| Black stars 			| Low visible star selected, but not selected more visible one 	| 2  	 |
| Black stars			| Invisible star selected 					| 3 	 |
| Smallest vs. Highest 		| Either one answer is 'none' and the other isn't 		| 3 	 |
| Smallest vs. Highest 		| Smallest number not in < 1;7 > interval			| 3	 |
| Smallest vs. Highest 		| Highest number not in < 1;7 > interval			| 3 	 |
| Smallest vs. Highes	 	| Highest visible number is smaller then the Smallest 		| 1 	 |
| Focus				| Time on page lower than 6 seconds 				| 1 	 |
| Clicking on dark area to find stars 									 |
| 					|		1.)	More than 1 click		| 1 	 |
|					|		2.)	More than 3 clicks		| 3 	 |

### Reliability checking recommendation

As it can be seen from previous table, each test has a different number of points assigned, as some of the tests represent direct information about cheating, and some of them might be misinterpreted and performed poorly by mistake of the user. We allow some minor mistakes, whereas we do not want cheating in our application. For each test, collected points are normalized to the max value of 10: 

```
$normScore = ( 10 / $max ) * $cheats
```

,where $max is 20 (screen test) or 10 (video test), and $cheats are collected points. This score is then mapped into the percentage score by using a non-linear function. Non-linear function should have a steep decrease for higher number of points as more points means higher probability of cheating worker. The recommended function is:

```
$perc = round( 100 * ( -0.5 * ( tanh($normScore - 3) - 1 ) ) )
```

As it can be seen, each test has a different number of points assigned, as some of the tests represent direct information about cheating, and some of them might be misinterpreted and performed poorly by mistake of the user. We allow some minor mistakes, whereas we do not want cheating in our application. For each test, collected points are normalized to the max value of 10: 

```
$normScore = ( 10 / $max ) * $cheats
```

,where $max is 20 (screen test), and $cheats are collected points. This score is then mapped into the percentage score by using a non-linear function. Non-linear function should have a steep decrease for higher number of points as more points means higher probability of cheating worker. The recommended function is:

```
$perc = round( 100 * ( -0.5 * ( tanh($normScore - 3) - 1 ) ) )
```

ploted as:

![hyperbolic tangens](https://raw.github.com/St1c/screentest/master/img/tanh.png "Hyperbolic tangens")

The percentage score is stored with every test. The overall reliability score of the users is calculated as an average value from all test scores user already finished (let’s say for screen test he achieved 91% and for other tests 98%, so the users reliability is 95%). This functionality offers, that only users with reliability above certain threshold (usually 91%) are invited to continue with the campaign (just a recommendation). 
