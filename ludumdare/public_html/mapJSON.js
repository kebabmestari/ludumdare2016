/// this file has all the maps in JSON
/// plaintext files are in maps folder

// global map reposity
var _maps = [];

_maps.push({
    name: 'Spear',
    tiles: [
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,1],
        [1,1,0,1,1,0,1,0,1],
        [1,1,0,0,0,0,1,0,1],
        [1,0,1,0,0,1,0,0,1],
        [1,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,0,0,0,1],
        [1,1,1,1,1,1,1,1,1],
          ],
    objects: [
        ['rock', {x: 2, y: 6}],
        ['stick', {x: 1, y: 5}],
        ['stick', {x: 3, y: 4}],
        ['flint', {x: 1, y: 1}]
    ],
    shape: 'spear'
});

_maps.push({
    name: 'Bowl',
    tiles: [
        [1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1],
        [1,0,1,0,1,0,1],
        [1,0,0,0,0,0,1],
        [1,0,0,0,0,0,1],
        [1,0,0,0,0,0,1],
        [1,1,1,1,1,1,1],
          ],
    objects: [
        ['rock', {x: 5, y: 2}],
        ['rock', {x: 5, y: 5}],
        ['stick', {x: 1, y: 1}],
        ['stick', {x: 1, y: 2}],
        ['stick', {x: 1, y: 3}],
    ],
    shape: 'bowl'
});

_maps.push({
    name: 'Jacket',
    tiles: [
        [1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,0,1],
        [1,0,1,0,1,0,0,1],
        [1,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1],
          ],
    objects: [
        ['stick', {x: 1, y: 6}],
        ['hide', {x: 6, y: 1}],
        ['hide', {x: 2, y: 4}],
        ['hide', {x: 2, y: 6}],
        ['hide', {x: 3, y: 6}],
        ['hide', {x: 5, y: 3}],
    ],
    shape: 'jacket'
});

// namespace for possible shapes
_shapes = {
    'spear':
    [
        ['flint'],
        ['stick'],
        ['stick'],
    ],
    'bowl' : [
        ['stick', 'none', 'stick'],
        ['none', 'stick', 'none'],
    ],
    'jacket' : [
        ['hide', 'stick', 'hide'],
        ['hide', 'hide', 'hide'],
    ],
    'altar' : [
        ['stick', 'stick', 'stick'],
        ['rock', 'rock', 'rock'],
        ['rock', 'none', 'rock'],
    ]
};