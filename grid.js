var containerWidth = 0;
var width = 0;
var height = 0;
var num = 0;

var grid;
var data;

loadGrid(getPattern())

function gridData() {
    var grid = document.getElementById("grid");
    var cs = getComputedStyle(grid.parentElement);
    this.containerWidth = (grid.clientWidth - parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) - 5)*0.65;
    var number = num + 1
    var data = new Array();
    var xpos = (grid.clientWidth - this.containerWidth)/ 2;
    var ypos = 5;
    this.width = this.containerWidth / number;
    this.height = this.width;
    var click = 0;

    // iterate for rows	
    for (var row = 0; row < number; row++) {
        data.push(new Array());

        // iterate for cells/columns inside rows
        for (var column = 0; column < number; column++) {
            data[row].push({
                row: row,
                column: column,
                x: xpos,
                y: ypos,
                width: this.width,
                height: this.height,
                click: click
            })
            // increment the x position. I.e. move it over by 50 (width variable)
            xpos += this.width;
        }
        // reset the x position after a row is complete
        xpos = (grid.clientWidth - this.containerWidth)/ 2;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += this.height;
    }
    return data;
}

function loadGrid(pattern) {
    var url = new URL(document.location);
    var urlParams = url.searchParams;
    var permutation = getPermutation()

    data = gridData();
    
    grid = d3.select("#grid")
    
    grid.attr("height", containerWidth + 5);
    
    var row = grid.selectAll(".row")
        .data(data)
        .enter().append("g")
        .attr("class", "row align-items-center");
    
    var column = row.selectAll(".square")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("class", function (d) { return "square row_" + d.row + " column_" + d.column; })
        .attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .attr("width", function (d) { return d.width; })
        .attr("height", function (d) { return d.height; })
        .style("fill", "#FFFFFF")
        .style("stroke", "#222")
    
    
    permutation.forEach(createDot);

    function createDot(value, index, array) {
        var xpos = (document.getElementById("grid").clientWidth - this.containerWidth)/ 2;
        grid.append("circle")
            .attr("cx", ((index+1)* width) + xpos)
            .attr("cy", (permutation.length - value + 1) * height + 5)
            .attr("r", (permutation.length < 9 ? 15 - (permutation.length) * 1 : 15 - 8 * 1));
    }

    if(pattern) {
        grid.selectAll(".square").each(function(d) {
            if(pattern[d.row][d.column] == 1) {
                d.click++;
                d3.select(this).style("fill", "#AEAEAE")
            }
        })
    }
    var representation = urlParams.get('type');

if (representation == 2 || representation == 3) {
    column.on('click', function (d) {
        data.forEach(function (value) {
            value.forEach(function (item) {
                if(item.column == d.column) {
                    item.click++;
                }
            })
            
        })

        if ((d.click) % 2 == 0) {
            row.selectAll(".column_" + d.column).style("fill", "#FFFFFF");
            
            if (representation == 3) {
                grid.selectAll(".square").each(function(square) {
                    if(!(square.row == 0 || square.row == permutation.length)) {
                        d3.select(this).style("fill", "#FFFFFF")
                    }
                })
            }
        }
        if ((d.click) % 2 == 1) {
            row.selectAll(".column_" + d.column).style("fill", "#AEAEAE");
            if (representation == 3) {
                grid.selectAll(".square").each(function(square) {
                    if(!(square.row == 0 || square.row == permutation.length)) {
                        d3.select(this).style("fill", "#AEAEAE")
                    }
                })
            }
        }
        
    });
}

else if (representation == 4) {
    column.on('click', function (d) {
        d.click++;
        if ((d.click) % 2 == 0) {
            d3.select(this).style("fill", "#fff");
        }
        if ((d.click) % 2 == 1) {
            d3.select(this).style("fill", "#AEAEAE");
        }
    });

}

else if(representation == 5) {
    grid.selectAll(".square").each(function(d) {
        if((!(d.row == 0 || d.row == permutation.length)) && !(d.column == 0 || d.column == permutation.length)) {
            d3.select(this).style("fill", "#AEAEAE")
        }
    })
}

else if(representation == 6) {
    grid.selectAll(".square").each(function(d) {
        if(!(d.column == 0 || d.column == permutation.length)) {
            d3.select(this).style("fill", "#AEAEAE")
        }
    })
}


}

function getPermutation() {
    var url = new URL(document.location);
    var urlParams = url.searchParams;
    
    if(urlParams.get('permutation')) {
        var permutation =  urlParams.get('permutation').split(',')
        num = permutation.length
    }

    else {
        var permutation =  []
        num = -1
    }

    return permutation
}

$(document).on('click', '#clearpattern', function () {
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    if(urlParams.get("type") == 2 || urlParams.get("type") == 3 || urlParams.get("type") == 4) {
        clearSquares();
    }
    
});

function clearSquares() {
    grid.selectAll(".square")
        .style('fill', "#FFFFFF")

    data.forEach(function (value) {
        value.forEach(resetClicks)
    })
}

function resetClicks(value) {
    value.click = 0;
}

function getPattern() {
    var url = new URL(document.location);
    var urlParams = url.searchParams;

    var id = urlParams.get("id")

    var pattern = null
    if(id) {
        pattern = (JSON.parse(sessionStorage.getItem(id))).pattern;
    
    }

    return pattern
}
window.addEventListener('popstate', function (event) {
    grid.selectAll(".row").remove()
    grid.selectAll("circle").remove()
    
    loadGrid(getPattern())
});

$(document).on('click', '.pattern-input', function (e) {
    var url = new URL(document.location);
    var urlParams = url.searchParams;
    var patternid = $(this).parent().attr("value");
    var pattern = JSON.parse(sessionStorage.getItem(patternid));
    
    
    if($(this).is(":checked")) {
        urlParams.set('id', patternid);
        urlParams.set('permutation', pattern.permutation)
        urlParams.set('type', pattern.patterntype)
        urlParams.set('contain', pattern.containment)
    
        window.history.pushState({}, '', url);

        
        $(".pattern-input").prop("checked" ,false) //uncheck all checkboxes
        $(this).prop("checked", true)
       
        $(".patternbtn").removeClass("selected-pattern")
        $(this).parent().addClass("selected-pattern")
        grid.selectAll(".row").remove()
        grid.selectAll("circle").remove()
        loadGrid(pattern.pattern)

        dispatchEvent(new PopStateEvent('popstate', {}));

    }
    
    else {
        urlParams.delete("permutation")
        urlParams.delete("id")
        urlParams.delete("contain")
        $(this).parent().removeClass("selected-pattern")
        $(this).prop("checked" ,false)
       
        window.history.pushState({}, '', url);

        dispatchEvent(new PopStateEvent('popstate', {}));

        
    }

    
   
 });