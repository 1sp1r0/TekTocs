import sinon from 'sinon'

export default sinon.mock()
                .returns(
                    {
                        "save": function () {return Promise.resolve(true)}
                     });
