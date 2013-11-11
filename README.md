Screen quality measurement application
=======


Simple application for harvesting information about the end user watching conditions for use in the video and image quality assessments.

License
=======
This screen quality testing application is licensed under a Creative Commons Attribution 3.0 Austria License.

THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

THIS SOFTWARE IS LICENSED FOR USAGE WITHIN STUDIES AND TRIALS CONDUCTED WITH CLOSED USER GROUPS. IT IS ALSO LICENSED FOR USAGE AS PART OF A PUBLICLY ACCESSIBLE ONLINE TEST PERFORMED AS CROWDSOURCING STUDIES. IT IS NOT LICENSEd FOR ANY COMMERCIONAL USAGE. 

ANY USE OF THIS OF THIS SOFTWARE MUST BE PROPERLY REFERENCED, AND FOLLOWING PUBLICATIONS MUST BE CITED:


Reliability checks
==================

Screen Quality page reliability checks (max 20 points): 

* Black stars: 				Numbers in stars array are not consecutive or 0 				(1 point)
* Black stars: 				Low visible star selected, but not selected more visible one 	(2 points)
* Black stars:				Invisible star selected 										(3 points)
* Smallest vs. Highest: 	Either one answer is 'none' and the other isn't 				(3 points)
* Smallest vs. Highest: 	Smallest number not in < 1;7 > interval							(3 points)
* Smallest vs. Highest: 	Highest number not in < 1;7 > interval							(3 points)
* Smallest vs. Highest: 	Highest visible number is smaller then the Smallest 			(1 point)
* Focus:					Time on page lower than 6 seconds 								(1 point)
* Clicking on dark area to find stars: 
							a)	More than 1 click:											(1 point)
							b)	More than 3 clicks:											(3 points)


As it can be seen, each test has a different number of points assigned, as some of the tests represent direct information about cheating, and some of them might be misinterpreted and performed poorly by mistake of the user. We allow some minor mistakes, whereas we do not want cheating in our application. For each test, collected points are normalized to the max value of 10: 

```
$normScore = ( 10 / $max ) * $cheats,
```

where $max is 20 (screen test) or 10 (video test), and $cheats are collected points. This score is then mapped into the percentage score by using a non-linear function. Non-linear function should have a steep decrease for higher number of points as more points means higher probability of cheating worker. The recommended function is:

```
$perc = round( 100 * ( -0.5 * ( tanh($normScore - 3) - 1 ) ) ).
```

As it can be seen, each test has a different number of points assigned, as some of the tests represent direct information about cheating, and some of them might be misinterpreted and performed poorly by mistake of the user. We allow some minor mistakes, whereas we do not want cheating in our application. For each test, collected points are normalized to the max value of 10: 

```
$normScore = ( 10 / $max ) * $cheats,
```

where $max is 20 (screen test) or 10 (video test), and $cheats are collected points. This score is then mapped into the percentage score by using a non-linear function. Non-linear function should have a steep decrease for higher number of points as more points means higher probability of cheating worker. The recommended function is:

```
$perc = round( 100 * ( -0.5 * ( tanh($normScore - 3) - 1 ) ) ).
```

(https://github.com/St1c/screentest/img/tanh.png)

The percentage score is stored with every test. The overall reliability score of the users is calculated as an average value from all test scores user already finished (let’s say for screen test he achieved 91% and for video test 98%, so the users reliability is 95%). Only users with reliability above certain threshold (usually 91%) are invited to rate more than 1 video. 