for(let i=0; i<3000000; i++){
    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    let overlappingPairCache = new Ammo.btDbvtBroadphase();
    let solver = new Ammo.btSequentialImpulseConstraintSolver();
    let physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, overlappingPairCache, solver, collisionConfiguration);

    collisionConfiguration.__destroy__();
    dispatcher.__destroy__();
    overlappingPairCache.__destroy__();
    solver.__destroy__();
    physicsWorld.__destroy__();
}
//=========================================================================================
for(let i=0; i<1_000_000; i++){
    let tmpVec = new Ammo.btVector3(2, 2, 2);
    let tmpQuat = new Ammo.btQuaternion( 0, 0, 0, 1);
    let tmpTransform = new Ammo.btTransform();
    let btShape = new Ammo.btBoxShape(tmpVec);
    tmpTransform.setOrigin(tmpVec);
    tmpTransform.setRotation(tmpQuat);

    let motionState = new Ammo.btDefaultMotionState(tmpTransform);
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, btShape, tmpVec);
    let rbody = new Ammo.btRigidBody(rbInfo);

    rbInfo.__destroy__();
    rbody.getMotionState().__destroy__();
    rbody.getCollisionShape().__destroy__();
    rbody.__destroy__();

    tmpVec.__destroy__();
    tmpQuat.__destroy__();
    tmpTransform.__destroy__();
}
//=========================================================================================
for(let i=0; i<100_000_000; i++){
    let transform = new Ammo.btTransform();
    let test = transform.getRotation();
    transform.__destroy__();
}
//=========================================================================================
for(let j=0; j<1_000_000; j++){
    let vec = new Ammo.btVector3(0, 0, 0);
    var mesh = new Ammo.btTriangleMesh(true, true);
    for (let i = 0; i < 10; i++){
        mesh.addTriangle(vec,vec, vec, false);
    }
    let shape = new Ammo.btBvhTriangleMeshShape(mesh, true, true);
    shape.__destroy__();
    mesh.__destroy__();
    vec.__destroy__();
}
//=========================================================================================
