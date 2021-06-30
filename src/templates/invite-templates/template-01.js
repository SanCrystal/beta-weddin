module.exports.template_01 = (mailDetails) => {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        <title>invitation card</title>
    </head>
    
    <body>
        <div class="container col s12" style="display: grid; ">
            <div class="row hoverable" style="margin: auto;">
                <div class="col s12 m12">
                    <div class="card">
                        <div class="card-image">
                            <img src="img\betawedding-01.PNG" alt="betawedding-01 image">
                            <span class="card-title "><h2>${ mailDetails.groomsName }<i>weds</i>${ mailDetails.bridesName }</h2></span>
                            <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">event_note</i></a>
                        </div>
                        <div class="card-content purple darken-3 yellow-text text-accent-1  flow-text">
                            <p>We the family's of
                                ${mailDetails.groomfamiliesName } and
                                    ${ mailDetails.bridefamiliesName } wish to invite you to the holy joining of the son
                                        ${ mailDetails.groomsName } and lovely daughter
                                            ${ mailDetails.bridesName } on 
                                                ${mailDetails.dateOfWedding }.</p>
                            <p> RSVP: very plenty lol</p>
                            <p>Courtesy :
                                ${mailDetails.courtesyFamily} family ; whatever</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    
    </body>
    
    </html>`
}