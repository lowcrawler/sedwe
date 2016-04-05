/**
 * Created by jfederer on 3/14/2015.
 */
var ut = ls.getItem('userType');
var menuItemsHTML = '<div data-role="controlgroup" data-corners="false">' +
	'<a href="#MainMenu" data-role="button">Main Menu</a>' +
	'<a href="#help_manual" data-role="button">User Manual</a>';
if(ut=='Technician' || ut=='Administrator') {
	menuItemsHTML += '<a href="http://caribbean-florida.water.usgs.gov/usgs/sedwe-mgmt/" data-role="button" target="_blank">SedWE Admin Module</a>';
}
menuItemsHTML += '</div>';
