THe Url shortener requires tehse things:

Front-end
1. field to input
2. button to action
3. another field to display result

Back-end
1. Logic that does encoding
2. Table lookup for already encoded urls
3. Database to store all these things.
4. redirect action (HTTP Code 301, permanent redirect)

Tech:

1. Express for making the node API
2. MongoDB for storing the hashed urls
