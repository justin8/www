+++
menu = "main"
date = "2016-05-19T00:00:00+10:00"
title = "Checking remote SSL certificates"
Description = ""
Tags = [
    "Development",
    "Bash",
    "Openssl",
    "Certificates",
]
Categories = [
    "Development",
    "Bash",
    "Openssl",
    "Certificates",
]
+++
Getting a remote SSL certificate from a server with openssl is pretty straightforward, it looks something like this: `openssl s_client -showcerts -connect www.dray.be:443`

If you run that it will however hang until the connection closes since it recieved no EOF from your client, so adding a `</dev/null` at the end to slurp /dev/null to stdin fixes this.

But if you're connecting to a server with multiple domains hosted using SNI, it will only return the default certificate. You need to specify `-servername` as well. i.e. `openssl s_client -showcerts -servername www.dray.be -connect 104.28.9.50:443 </dev/null`

Then if you want to check the expiry date of the certificates, you need to feed the certificate back in to openssl :) Along the lines of this: `openssl s_client -showcerts -servername www.dray.be -connect 104.28.9.50:443 </dev/null | openssl x509 -noout -dates`
