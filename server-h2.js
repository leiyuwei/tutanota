'use strict'

// http2 server

const nodeStatic = require('node-static')
const file = new nodeStatic.Server('build', {cache: false, gzip: true});
const http = require('spdy')

var fs = require('fs');

var options = {
	key: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1q/qXIC/sGPQ7
zZYOOs83Bp4SeLW29aeuDWHUWI05o5W4z8g7sVyDHleY59UAdhesD9mlLQDLB0kR
u0dMyaoX+sA5t5zHpPAqeILXbCvhgF88CR/zOkf6OKbBU4owLWMLfUnW+wCXiAHI
hmEypl6EYATNJOY7vl6TudYGT89alRqJHdf6bcaQ7WI6zIz5uqVlD761LhX36sID
r6psUMLnx1PlrJn0rG8sK8e61QaiMwbuPxoya5Jy2PdTQpSJiDJMz9uYqryLh9C7
/zDiJa5Gq0QuBioVkyE8VUmaYacCh0gznqyjYakTR8sD7qPycqEuCE8Zniq2cw22
G+Lnn9PFAgMBAAECggEAaG5xAXiuM5DwrIP0kz95KE90hHfBNWgnOKVWrEMvA4gm
o/NFThMZdAH4Jtx1k+tOlkkSOqIRB6SrezbluJ1gWqJ453TF+fm1WSSnSgBThTBP
DmrMY/wHri3spctI74LXoZ4m2R62a2TyaXvd2cjLIlszx11Dv+oh4dd80WoFbzK4
pZ7Otcdg8N8V6Wo57yWWyCLk0jZcQun1d6sYmNN6g01cVAWDB5CKfSmE9ymFUHkp
20NQvJygl86Dbe5MABe3ax+433w6yQ5SanhlMfa+t7zELkFz7Gb+eYlNeGvJXH0n
Rru5K/yLAmwuOGSs+qmRko1oDVveG5H6DdkkIPiJwQKBgQDjIwcaKdtNPBSxWWVL
PH/R7w1EXtBVPGWTs6LI8jyePviG0thfh8Y5Gso+LJ3lC8MWdJs9M+yGIdCtHVCK
q8s3c/fdp1owbQdPZnSiXYuTTS5SP7mZk307JanJxErnE70Izd7udNVPoM46CrP7
yxTQiMhRP6Y4OmJmdoaXskco1QKBgQDMwe5m93KUIWYflGCiwpuuH2DdeTmXfWca
LIVDysQJpkYmVZEhg2NMjjz1D0MNwkp+ssDpykrMKnDos6IuMPgb9/AptbnOEpNR
eCass0lFOzq+4KLdIhT0f3EPQNrrHzd9ovRVHxPF9/e0EwLimRbUXJnzYaa0vUkz
H9dGxu53MQKBgQDOAKPdX98NYpNl8i1DmmBXV9eRjeinlbqOxlq6o7DE2VnwdeRW
aD8o5ZpN34tpBEzw3ds6HBDF6n9nsvGsg3kxFxXUS4cp6oi5w7O+2tbPRy3e3PsJ
RdJLxbIDU+uXPriw9n7diMs6iB7iV3i7woljRNthjTfFQXajdZZGmSOe7QKBgQC5
RKRVEILhG5NO8a+6tYGtvICmBMEinHpEyZHPdFGLNaL1nqjR/RNFOtJXHncapPlI
yK8bG0owkBpXw+n0B6UHkYECDIdRuacIqUG9NAARH3WZLqLOmb8CN6nyFkm/QyCv
klmoB5WZpDPCAQ20QLbScfNur6Xqlfb8xkvAo9EzkQKBgDfUIsPC5RDox2vTbPt5
tzKJuSPGJWffBElZ9quHcgR046xcJa1MAv1SqQzhSsO4aYrZk9EkuxVkoZQSOeik
qqTYZU/6yp4m2/CCbC4/kLPwznGEutjJoLrRPFUsWj1x/KhU8S1SwU8hdtGlwVDv
UaS0qXVBwKh7D8lI/b66o4Hm
-----END PRIVATE KEY-----`,
	cert: `-----BEGIN CERTIFICATE-----
MIIDbzCCAlegAwIBAgIJANNKFluWVoytMA0GCSqGSIb3DQEBCwUAME4xCzAJBgNV
BAYTAkRFMRYwFAYDVQQIDA1OaWVkZXJzYWNoc2VuMRMwEQYDVQQKDApUdXRhbyBH
bWJIMRIwEAYDVQQDDAlsb2NhbGhvc3QwHhcNMTYwNDI1MDc1ODI4WhcNMjYwNDIz
MDc1ODI4WjBOMQswCQYDVQQGEwJERTEWMBQGA1UECAwNTmllZGVyc2FjaHNlbjET
MBEGA1UECgwKVHV0YW8gR21iSDESMBAGA1UEAwwJbG9jYWxob3N0MIIBIjANBgkq
hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtav6lyAv7Bj0O82WDjrPNwaeEni1tvWn
rg1h1FiNOaOVuM/IO7Fcgx5XmOfVAHYXrA/ZpS0AywdJEbtHTMmqF/rAObecx6Tw
KniC12wr4YBfPAkf8zpH+jimwVOKMC1jC31J1vsAl4gByIZhMqZehGAEzSTmO75e
k7nWBk/PWpUaiR3X+m3GkO1iOsyM+bqlZQ++tS4V9+rCA6+qbFDC58dT5ayZ9Kxv
LCvHutUGojMG7j8aMmuSctj3U0KUiYgyTM/bmKq8i4fQu/8w4iWuRqtELgYqFZMh
PFVJmmGnAodIM56so2GpE0fLA+6j8nKhLghPGZ4qtnMNthvi55/TxQIDAQABo1Aw
TjAdBgNVHQ4EFgQUCEMVVYyCEMYpdt/nm9CLL7lOrZcwHwYDVR0jBBgwFoAUCEMV
VYyCEMYpdt/nm9CLL7lOrZcwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOC
AQEAUsymmmFgj8G5qO1P8Gg2aC3jQOaieJVhI7COBq8NCFTlpsOaAP8hh7h7twft
hmJA389j5I9iEjmYBb8tVWaUSSxWgCbroCmQTD+wRFkrojFQ5uBuOm68qRPj0E5H
VwVgcsQHn6NCMAwOgb7+x4YEK5mcbCNed2cn4Y0cimrIMoVdpeDYn5MIjL32Y8Wp
WWZnk/ZcXz89Zpv4WKk9EjlWwFxRCOJkCKnJDneHBtMGiepSJZOP3hhJjPXehdji
pSt2Nyd5T+Crui8f8M2/OU5vZyRNFqq3ToPrutx5LHYJ8NV+HMxiBhCa7Yc0wcQ+
0cQYu0NeGFaL2leWQ12QCxxOnw==
-----END CERTIFICATE-----`
};

const server = http.createServer(options, function (request, response) {
	request.addListener('end', function () {
		//
		// Serve files!
		//
		file.serve(request, response);

	}).resume();
})



server.listen(9082)
