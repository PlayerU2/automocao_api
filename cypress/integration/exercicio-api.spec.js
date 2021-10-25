/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.body.usuarios[0].nome).to.equal('Fulano da Silva')
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `evelynn${Math.floor(Math.random() * 100000000)}@qa.com.br`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "Evelynn Alves",
                    "email": usuario,
                    "password": "1235",
                    "administrador": "true"
               }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario("Evelynn Alves", "evelynn@qa.com.br", "1235", "true")

               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')
               });
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuario = `evelynn${Math.floor(Math.random() * 100000000)}@qa.com.br`
          cy.cadastrarUsuario("Evelynn Silva", usuario, "1235", "true")
               .then(response => {
                    let id = response.body._id

                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         body:
                         {
                              "nome": "Evelynn Costa",
                              "email": usuario,
                              "password": "1236",
                              "administrador": "true"
                         }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })

               });
     })

     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuario = `evelynn${Math.floor(Math.random() * 100000000)}@qa.com.br`
          cy.cadastrarUsuario("Evelynn Silva", usuario, "1235", "true")
          .then(response => {
               let id = response.body._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`
               }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
               })
          })
     })

});
