var Path = require('fire-path');
var Fs = require('fire-fs');
var Async = require('async');
var _ = require('lodash');

var Project = {};
module.exports = Project;

/**
 * create project
 * @param {string} path
 * @param {object} runtime
 * @param {object} [template]
 * @param {function} cb
 */
Project.create = function ( path, runtime, template, cb ) {
    if ( Fs.existsSync(path) ) {
        if ( cb ) cb ( new Error('The path ' + path + ' already exists.') );
        return;
    }

    if ( !runtime ) {
        var runtimePath = Editor.url('app://runtime/runtime-pixi');
        var pkgJsonObj = JSON.parse(Fs.readFileSync( Path.join(runtimePath, 'package.json') ));
        runtime = {
            path: runtimePath,
            name: pkgJsonObj.name,
            version: pkgJsonObj.version,
            description: pkgJsonObj.description,
        };
    }

    //
    Async.series([
        function ( next ) {
            if ( template ) {
                // TODO: copy the template and create project
                next ();
            }
            else {
                next ();
            }
        },

        function ( next ) {
            Fs.mkdirsSync( path );
            Fs.mkdirSync( Path.join(path, 'settings') );
            Fs.mkdirSync( Path.join(path, 'local') );
            Fs.mkdirSync( Path.join(path, 'packages') );
            Fs.mkdirSync( Path.join(path, 'assets') );
            Fs.mkdirSync( Path.join(path, 'library') );

            var profile = {
                runtime: runtime.name,
                packages: 'packages',
                // mounts: ['assets'], TODO
            };
            Fs.writeFileSync(Path.join(path,'project.json'),
                             JSON.stringify(profile, null, 2));
            next();
        },
    ], function ( err ) {
        if ( cb ) cb (err);
    });
};

/**
 * add
 */
Project.add = function ( profile, path ) {
    // save new project to recently-opened
    var idx = profile['recently-opened'].indexOf(path);
    if ( idx === -1 ) {
        profile['recently-opened'].push(path);
    }
    profile.save();
};

/**
 * remove
 */
Project.remove = function ( profile, path ) {
    _.remove( profile['recently-opened'], function (item) {
        return item === path;
    });
    profile.save();
};

/**
 * check project
 */
Project.check = function ( projectPath, cb ) {
    if ( Fs.existsSync(projectPath) === false ) {
        if ( cb ) cb ( new Error('Project not exists!') );
        return;
    }

    Project.getInfo( projectPath, function ( info ) {
        if ( !info ) {
            if ( cb ) cb ( new Error('Can not find project.json') );
            return;
        }

        if ( info.error ) {
            if ( cb ) cb ( new Error(info.error) );
            return;
        }

        // validate folders and create them if not exists
        var path = Path.join(projectPath,'settings');
        if ( !Fs.existsSync(path) ) Fs.mkdirSync(path);

        path = Path.join(projectPath,'local');
        if ( !Fs.existsSync(path) ) Fs.mkdirSync(path);

        path = Path.join(projectPath,'packages');
        if ( !Fs.existsSync(path) ) Fs.mkdirSync(path);

        path = Path.join(projectPath,'assets');
        if ( !Fs.existsSync(path) ) Fs.mkdirSync(path);

        path = Path.join(projectPath,'library');
        if ( !Fs.existsSync(path) ) Fs.mkdirSync(path);

        if ( cb ) cb ( null, info );
    });
};

/**
 * getInfo
 */
Project.getInfo = function ( path, cb ) {
    var pjsonPath = Path.join( path, 'project.json');
    if ( Fs.existsSync(pjsonPath) === false  ) {
        if ( cb ) cb ();
        return;
    }

    var pjsonObj;
    try {
        pjsonObj = JSON.parse(Fs.readFileSync(pjsonPath));
        if ( !pjsonObj.runtime ) {
            if ( cb ) cb ({
                path: path,
                name: Path.basename(path),
                runtime: 'unknown',
                error: 'Can not find runtime in project.json',
            });
            return;
        }
    }
    catch ( err ) {
        if ( cb ) {
            cb ({
                path: path,
                name: Path.basename(path),
                runtime: 'unknown',
                error: 'project.json broken',
            });
        }
        return;
    }

    // correct!
    if ( cb ) {
        cb ({
            path: path,
            name: Path.basename(path),
            runtime: pjsonObj.runtime,
        });
    }
};
