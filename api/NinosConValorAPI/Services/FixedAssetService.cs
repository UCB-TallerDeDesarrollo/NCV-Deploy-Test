﻿using AutoMapper;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using NinosConValorAPI.Data.Entity;
using NinosConValorAPI.Data.Repository;
using NinosConValorAPI.Exceptions;
using NinosConValorAPI.Models;
using System.Collections.Immutable;

namespace NinosConValorAPI.Services
{
    public class FixedAssetService : IFixedAssetService
    {
        private INCVRepository _NCVRepository;
        private IMapper _mapper;
        public FixedAssetService(INCVRepository fixedAssetRepository, IMapper mapper)
        {
            _NCVRepository = fixedAssetRepository;
            _mapper = mapper;
        }

        private async Task<ProgramHouseEntity> GetProgramHouseAsync(int programHouseId)
        {
            var programHouse = await _NCVRepository.GetProgramHouseAsync(programHouseId);
            if (programHouse == null)
                throw new NotFoundElementException($"El programa con id {programHouseId} no se encontrós");
            return programHouse;
        }

        public async Task<FixedAssetModel> CreateFixedAssetAsync(FixedAssetModel fixedAsset, int programHouseId, int categoryId)
        {
            //fixedAsset.ProgramHouseId = fixedAsset.ProgramHouseId == 0 ? 2 : fixedAsset.ProgramHouseId;
            await GetProgramHouseAsync(programHouseId);
            fixedAsset.ProgramHouseId = programHouseId;
            var fixedAssetEntity = _mapper.Map<FixedAssetEntity>(fixedAsset);
            _NCVRepository.CreateFixedAsset(fixedAssetEntity, programHouseId, categoryId);
            var result = await _NCVRepository.SaveChangesAsync();
            
            if (result)
            {
                if (fixedAssetEntity.Name == null || fixedAssetEntity.Price == null)
                {
                    throw new NotFoundElementException($"Ocurrio un error al crear el Activo Fijo, faltan datos o paso algo inesperado.");
                }
                return _mapper.Map<FixedAssetModel>(fixedAssetEntity);
            }
            throw new Exception("Error en la base de datos.");
        }

        public async Task<IEnumerable<FixedAssetModel>> GetFixedAssetsAsync(int categoryId)
        {
            var fixedAssetEntityList = await _NCVRepository.GetFixedAssetsAsync(categoryId);
            
            if (fixedAssetEntityList == null || !fixedAssetEntityList.Any())
                throw new NotFoundElementException($"La lista de Activos Fijos no existe o está vacía.");

            return _mapper.Map<IEnumerable<FixedAssetModel>>(fixedAssetEntityList);
        }

        public async Task<FixedAssetModel> GetFixedAssetAsync(int fixedAssetId, int categoryId)
        {
            var fixedAsset = await _NCVRepository.GetFixedAssetAsync(fixedAssetId, categoryId);

            if (fixedAsset == null)
                throw new NotFoundElementException($"El activo fijo con Id:{fixedAssetId} no existe.");

            return _mapper.Map<FixedAssetModel>(fixedAsset);
        }
    }
}
